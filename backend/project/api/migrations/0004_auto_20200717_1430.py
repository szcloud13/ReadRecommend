# Generated by Django 3.0.7 on 2020-07-17 04:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200717_1423'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userbookmetadata',
            name='time_read',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
