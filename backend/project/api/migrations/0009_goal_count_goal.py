# Generated by Django 3.0.7 on 2020-07-21 02:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_goal_current'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='count_goal',
            field=models.IntegerField(default=0),
        ),
    ]
