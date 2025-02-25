# Generated by Django 5.1.6 on 2025-02-25 11:30

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Driver",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("license_number", models.CharField(max_length=50, unique=True)),
                ("phone_number", models.CharField(max_length=15)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Journey",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("start_location", models.CharField(max_length=255)),
                ("end_location", models.CharField(max_length=255)),
                ("start_time", models.DateTimeField()),
                ("end_time", models.DateTimeField(blank=True, null=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PLANNED", "Planned"),
                            ("IN_PROGRESS", "In Progress"),
                            ("COMPLETED", "Completed"),
                            ("CANCELLED", "Cancelled"),
                        ],
                        default="PLANNED",
                        max_length=20,
                    ),
                ),
                (
                    "total_distance",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=10, null=True
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "driver",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="journeys",
                        to="core.driver",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="LogEntry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "activity_type",
                    models.CharField(
                        choices=[
                            ("DRIVING", "Driving"),
                            ("ON_DUTY", "On Duty Not Driving"),
                            ("OFF_DUTY", "Off Duty"),
                            ("SLEEPER", "Sleeper Berth"),
                        ],
                        max_length=20,
                    ),
                ),
                ("start_time", models.DateTimeField()),
                ("end_time", models.DateTimeField(blank=True, null=True)),
                ("location", models.CharField(max_length=255)),
                ("notes", models.TextField(blank=True)),
                (
                    "odometer_reading",
                    models.PositiveIntegerField(
                        validators=[django.core.validators.MinValueValidator(0)]
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "journey",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="log_entries",
                        to="core.journey",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="RestStop",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("location", models.CharField(max_length=255)),
                ("planned_arrival", models.DateTimeField()),
                ("actual_arrival", models.DateTimeField(blank=True, null=True)),
                (
                    "planned_duration",
                    models.PositiveIntegerField(help_text="Duration in minutes"),
                ),
                (
                    "actual_duration",
                    models.PositiveIntegerField(
                        blank=True, help_text="Duration in minutes", null=True
                    ),
                ),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "journey",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="rest_stops",
                        to="core.journey",
                    ),
                ),
            ],
        ),
    ]
