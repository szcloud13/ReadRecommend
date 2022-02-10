from django.urls import path
from . import books

urlpatterns = [
    path("data", books.data),
    path("search", books.search),
    path("random", books.random),
    path("random_not_library", books.random_not_library), 
    path("is_read", books.is_read), 
    path("set_read", books.set_read),
    path("add_book", books.add_book),
    path("search_book", books.search_book),
    path("readers", books.readers),
    path("recommendations", books.recommendations),
    path("filter",books.filter),
    path("keyword",books.keyword), 
    path("history",books.history)
   # path("stats", books.stats)
]
