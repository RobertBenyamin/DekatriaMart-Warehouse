# Generated by Django 4.2.5 on 2023-09-22 15:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='location',
            new_name='warehouse_location',
        ),
    ]
