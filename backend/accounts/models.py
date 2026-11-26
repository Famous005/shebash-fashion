import re
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    """Custom manager supporting email or phone login."""

    def create_user(self, email, password, full_name, phone_e164=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required.')
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            full_name=full_name,
            phone_e164=phone_e164,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, full_name='Admin', **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, full_name, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model for Shebash Fashion.
    Login supported via email+password or phone+password.
    """

    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('tailor_staff', 'Tailor Staff'),
        ('admin', 'Admin'),
    ]

    full_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=191, unique=True)
    phone_e164 = models.CharField(
        max_length=25,
        unique=True,
        null=True,
        blank=True,
        help_text='Format: +2348012345678. Required for WhatsApp alerts.'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='customer'
    )
    preferred_currency = models.CharField(max_length=3, default='NGN')

    # Django required fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    # Login with email by default
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.full_name} ({self.email})'

    def clean(self):
        """Validate phone is in E.164 format if provided."""
        if self.phone_e164:
            pattern = r'^\+[1-9]\d{7,14}$'
            if not re.match(pattern, self.phone_e164):
                from django.core.exceptions import ValidationError
                raise ValidationError(
                    {'phone_e164': 'Phone must be in E.164 format e.g. +2348012345678'}
                )

    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_tailor_staff(self):
        return self.role == 'tailor_staff'