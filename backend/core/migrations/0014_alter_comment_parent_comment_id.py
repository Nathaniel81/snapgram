# Generated by Django 5.0.3 on 2024-06-24 12:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_remove_comment_parent_comment_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='parent_comment_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
