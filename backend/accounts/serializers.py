from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """Handles new customer registration."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'full_name',
            'email',
            'phone_e164',
            'password',
            'password_confirm',
        ]
        extra_kwargs = {
            'phone_e164': {'required': False},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {'password_confirm': 'Passwords do not match.'}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            phone_e164=validated_data.get('phone_e164'),
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Returns safe public profile data — no password."""

    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'email',
            'phone_e164',
            'role',
            'preferred_currency',
            'created_at',
        ]
        read_only_fields = ['id', 'role', 'created_at']


class ShebashTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT login serializer.
    Supports login with email OR phone number + password.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Allow 'login_id' as the identifier field (email or phone)
        self.fields['login_id'] = serializers.CharField()
        self.fields.pop('email', None)

    def validate(self, attrs):
        login_id = attrs.get('login_id', '').strip()
        password = attrs.get('password', '')

        # Determine if login_id is email or phone
        if '@' in login_id:
            try:
                user = User.objects.get(email=login_id)
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {'login_id': 'No account found with this email address.'}
                )
        else:
            try:
                user = User.objects.get(phone_e164=login_id)
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {'login_id': 'No account found with this phone number.'}
                )

        if not user.check_password(password):
            raise serializers.ValidationError(
                {'password': 'Incorrect password.'}
            )

        if not user.is_active:
            raise serializers.ValidationError(
                {'login_id': 'This account has been deactivated.'}
            )

        # Generate tokens
        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserProfileSerializer(user).data,
        }