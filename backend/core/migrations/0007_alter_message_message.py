# Generated by Django 5.0.3 on 2024-04-28 14:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_chatroom_message_delete_chatmessage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='message',
            field=models.CharField(max_length=255),
        ),
    ]