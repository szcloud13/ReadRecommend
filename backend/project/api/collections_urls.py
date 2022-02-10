from django.urls import path
from . import collections

urlpatterns = [
	path("create_collection", collections.create_collection),
	path("delete_collection", collections.delete_collection),
    path("view_collection", collections.view_collection),
    path("add_to_library", collections.add_to_library),
    path("add_title", collections.add_title),
    path("delete_from_library", collections.delete_from_library),
    path("delete_title", collections.delete_title),
    path("rename", collections.rename), 
    path("add_tag", collections.add_tag),
    path("delete_tag", collections.delete_tag),
    path("get_tags", collections.get_tags),
    path("get_tagged_collections", collections.get_tagged_collections),
    path("get_similar_collections", collections.get_similar_collections),
    path("recent_added", collections.recent_added)
]
