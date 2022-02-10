from django.contrib import admin

# Register your models here.
from .models import *

# admin.site.register(Question)
class BookMetadataAdmin(admin.ModelAdmin):
    readonly_fields = ('time_added',)

admin.site.register(Book)
admin.site.register(Collection)
admin.site.register(Profile)
admin.site.register(Tag)
admin.site.register(BookInstance)
admin.site.register(Review)
admin.site.register(CollectionBookMetadata, BookMetadataAdmin)
admin.site.register(UserBookMetadata)
admin.site.register(Goal)
admin.site.register(BookStats)