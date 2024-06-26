# Generated by Django 5.0.5 on 2024-05-07 08:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Achievement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quest_points', models.IntegerField()),
                ('num_badges', models.IntegerField()),
                ('days_active', models.IntegerField()),
                ('num_achievements', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Address',
            fields=[
                ('address_id', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('street_address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=20)),
                ('province', models.CharField(max_length=10)),
                ('zip_code', models.CharField(max_length=6)),
                ('primary_address', models.BooleanField(default=False)),
                ('address_type', models.CharField(choices=[('HOME', 'Home'), ('WORK', 'Work'), ('SCHOOL', 'School'), ('BILLING', 'Billing'), ('MAILING', 'Mailing'), ('OTHER', 'Other')], default='HOME', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Badge',
            fields=[
                ('badge_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('img_link', models.CharField(max_length=255)),
                ('rarity', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
                ('points', models.IntegerField()),
                ('category', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('phone_number', models.CharField(max_length=10)),
                ('email', models.CharField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('linkedin', models.CharField(blank=True, max_length=255)),
                ('twitter', models.CharField(blank=True, max_length=255)),
                ('facebook', models.CharField(blank=True, max_length=255)),
                ('verified', models.BooleanField()),
                ('achievement', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user', to='pages.achievement')),
                ('addresses', models.ManyToManyField(related_name='users', to='pages.address')),
            ],
        ),
        migrations.CreateModel(
            name='User_Badge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('granted_date', models.DateTimeField()),
                ('expiry_date', models.DateTimeField(blank=True, null=True)),
                ('active', models.BooleanField(default=True)),
                ('badge', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pages.badge')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pages.user')),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='badges',
            field=models.ManyToManyField(through='pages.User_Badge', to='pages.badge'),
        ),
        migrations.AddField(
            model_name='badge',
            name='users',
            field=models.ManyToManyField(through='pages.User_Badge', to='pages.user'),
        ),
    ]
