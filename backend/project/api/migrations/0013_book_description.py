# Generated by Django 3.0.7 on 2020-07-27 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_book_genre'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='description',
            field=models.CharField(default='', max_length=1024),
            preserve_default=False,
        ),
    ]
