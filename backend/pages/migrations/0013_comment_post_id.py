# Generated by Django 5.0.4 on 2024-05-17 18:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0012_user_comments_list_post_user_posts_list'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='post_id',
            field=models.IntegerField(default=0),
        ),
    ]
