# Generated by Django 3.0.7 on 2020-07-20 00:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20200719_1613'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='date_start',
            field=models.DateField(),
        ),
    ]