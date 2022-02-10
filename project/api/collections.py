from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import Collection, Book, Tag, MAX_STR_LEN, User, CollectionBookMetadata, UserBookMetadata
from django.core import serializers
from .utilities import auth_validator, input_validator, user_validator
from django.contrib.auth.models import User


@api_view(["POST"])
@auth_validator
@input_validator(["collection_name"])
# given user id returns creates empty collection, returns collection_id
def create_collection(request):
    user = request.user
    collection_name = request.POST["collection_name"]
    if len(collection_name) > MAX_STR_LEN:
        return Response({"status": "error", "message": "Name too long"}, status=status.HTTP_200_OK)

    if user.collection_set.filter(name=collection_name).exists():
        return Response({"status": "error", "message": "Collection with the same name already exists"}, status=status.HTTP_226_IM_USED)

    collection = Collection.objects.create_collection(
        name=collection_name, user=user)

    return Response({"status": "ok", "message": "Collection successfully added", "collection_id": collection.collection_id}, status=status.HTTP_200_OK)


@api_view(["POST"])
@auth_validator
@input_validator(["collection_id"])
# given user id returns creates empty collection, returns collection_id
def delete_collection(request):
    user = request.user
    try:
        collection = user.collection_set.get(
            collection_id=request.POST["collection_id"])
    except:
        return Response({"status": "error", "message": "invalid collection"}, status=status.HTTP_200_OK)

    if(collection.library):
        return Response({"status": "error", "message": "Cannot delete library"}, status=status.HTTP_200_OK)

    collection.delete()
    return Response({"status": "ok", "message": "Collection successfully deleted"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@auth_validator
@input_validator(["collection_id"])
# given collection id returns collection name, tag list, book list
def view_collection(request):
    try:  # check collection exists
        collection = Collection.objects.get(
            collection_id=request.GET["collection_id"])
    except:
        return Response({"status": "error", "message": "Collection not found"}, status=status.HTTP_200_OK)
    owner = False
    if collection.user == request.user:
        owner = True
    tag_list = []
    for tag in collection.tags.all():
        tag_list.append({'tag': tag.name})

    book_list = []
    for book in collection.books.all():
        book_list.append({"id": book.id, "title": book.title})
    return Response({"status": "ok", "message": "Collection data delivered",
                     "collection_name": collection.name, "book_list": book_list, "tag_list": tag_list, "owner":owner}, status=status.HTTP_200_OK)


@api_view(["POST"])
@auth_validator
@input_validator(["collection_id", "id"])
def add_title(request):  # given collection_id and id, adds book to collection, returns new book list
    try:  # check collection exists
        collection = request.user.collection_set.get(
            collection_id=request.POST["collection_id"])
    except:
        return Response({"status": "error", "message": "Collection not found"}, status=status.HTTP_200_OK)
    try:  # check book exists
        id = request.POST["id"]
        book = Book.objects.get(id=id)
    except:
        return Response({"status": "error", "message": "Book not found"}, status=status.HTTP_200_OK)
    try:  # check if book already in collection
        collection.books.get(id=id)
        return Response({"status": "error", "message": "Book is already in collection"}, status=status.HTTP_200_OK)
    except:
        CollectionBookMetadata.objects.create_collectionbookmetadata(collection, book)
        collection.books.add(book)
        collection.save()

        # Add to library if it is not in there already
        library = collection.user.collection_set.get(library=True)
        if book not in library.books.all():
            CollectionBookMetadata.objects.create_collectionbookmetadata(library, book)
            UserBookMetadata.objects.create_userbookmetadata(request.user, book)
            library.books.add(book)
            library.save()

        return Response({"status": "ok", "message": "Book added to collection"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@auth_validator
@input_validator(["id"])
def add_to_library(request):
    library = request.user.collection_set.get(library=True)
    try:  # check book exists
        id = request.POST["id"]
        book = Book.objects.get(id=id)
    except:
        return Response({"status": "error", "message": "Book not found"}, status=status.HTTP_200_OK)
    try:  # check if book already in collection
        library.books.get(id=id)
        return Response({"status": "error", "message": "Book is already in library"}, status=status.HTTP_200_OK)
    except:
        CollectionBookMetadata.objects.create_collectionbookmetadata(library, book)
        UserBookMetadata.objects.create_userbookmetadata(request.user, book)
        library.books.add(book)
        library.save()
    return Response({"status": "ok", "message": "Book added to library"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@auth_validator
@input_validator(["id"])
def delete_from_library(request):
    # Check the book is real first
    try:
        book = Book.objects.get(id=request.POST["id"])
    except:
        return Response({"status": "error", "message": "Book not found"}, status=status.HTTP_204_NO_CONTENT)

    count = 0

    collections = request.user.collection_set.all()
    for collection in collections:
        try:
            matching_books = collection.books.get(id=request.POST["id"])
            collection.books.remove(matching_books)
            collection.save()
            collection.collectionbookmetadata_set.filter(book = book).delete()
            #collection.bookmetadata_set.remove(book_metadata)
            count += 1
        except:
            pass
    try:
        request.user.userbookmetadata_set.filter(book = book).delete()
    except:
        pass

    if count == 0:
        return Response({"status": "error", "message": "Book is not in library"}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({"status": "ok", "message": "Book removed from library"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@auth_validator
@input_validator(["collection_id", "id"])
def delete_title(request):  # given collection_id and id, removes book from collection
    try:
        collection = request.user.collection_set.get(
            collection_id=request.POST["collection_id"])
    except:
        return Response({"status": "error", "message": "Collection not found"}, status=status.HTTP_200_OK)
    try:
        id = request.POST["id"]
        book = Book.objects.get(id=id)
    except:
        return Response({"status": "error", "message": "Book not found"}, status=status.HTTP_200_OK)
    try:  # error if book already in collection
        collection.books.get(id=id)
        collection.books.remove(book)
        collection.save()
        collection.collectionbookmetadata_set.filter(book = book).delete()
        return Response({"status": "ok", "message": "Book removed from collection"}, status=status.HTTP_200_OK)
    except:
        return Response({"status": "error", "message": "Book is not in collection"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@auth_validator
@input_validator(["collection_id", "collection_name"])
def rename(request):  # given collection_id and new collection name, renames collection
    # returns collection name
    user = request.user
    try:
        collection = user.collection_set.get(
            collection_id=request.POST["collection_id"])
    except:
        return Response({"status": "error", "message": "Collection not found"}, status=status.HTTP_200_OK)

    collection_name = request.POST["collection_name"]

    if len(collection_name) > MAX_STR_LEN:
        return Response({"status": "error", "message": "Name too long"}, status=status.HTTP_200_OK)

    if user.collection_set.filter(name=collection_name).exists():
        return Response({"status": "error", "message": "Collection with the same name already exists"}, status=status.HTTP_226_IM_USED)

    collection.name = collection_name
    collection.save()

    return Response({"status": "ok", "message": "Collection successfully renamed"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@input_validator(["collection_id", "tag_label"])
def add_tag(request):  # given collection id and tag label, adds tag to collection
    # returns collection name, tag list and book list.
    try:
        collection = Collection.objects.get(
            collection_id=request.POST["collection_id"])
    except:
        return Response({"status": "error", "message": "Collection not found"}, status=status.HTTP_200_OK)
    tag_label = request.POST["tag_label"]
    try:
        tag = Tag.objects.get(name=tag_label)
    except:
        tag = Tag.objects.create(name=tag_label)

    try:
        collection.tags.get(name=tag_label)
        return Response({"status": "error", "message": "Collection already has this tag"}, status=status.HTTP_200_OK)
    except:
        collection.tags.add(tag)
        collection.save()
    return Response({"status": "ok", "message": "Tag successfully added to collection"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@input_validator(["collection_id", "tag_label"])
def delete_tag(request):  # given collection id and tag label, removes tag from collection
    # returns collection name, tag list and book list.
    try:
        collection = Collection.objects.get(
            collection_id=request.POST["collection_id"])
    except:
        return Response({"status": "error", "message": "Collection not found"}, status=status.HTTP_200_OK)
    tag_label = request.POST["tag_label"]
    try:
        tag = Tag.objects.get(name=tag_label)
    except:
        return Response({"status": "error", "message": "Tag not found"}, status=status.HTTP_200_OK)

    try:
        collection.tags.get(name=tag_label)
        collection.tags.remove(tag)
        collection.save()
        return Response({"status": "ok", "message": "Tag successfully removed from collection"}, status=status.HTTP_200_OK)

    except:
        return Response({"status": "error", "message": "Collection does not have this tag"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@input_validator(["collection_id"])
def get_tags(request):
    try:
        collection = Collection.objects.get(
            collection_id=request.GET["collection_id"])
    except:
        return Response({"status": "error", "message": "Collection not found"}, status=status.HTTP_200_OK)

    tags = collection.tags.all()

    tag_list = []
    for tag in tags:
        tag_list.append({"tag_label": tag.name})

    if len(tag_list) == 0:
        return Response({"status": "ok", "message": "Collection has no tags"}, status=status.HTTP_200_OK)
    else:
        return Response({"status": "ok", "message": "Got tags", "tag_list": tag_list}, status=status.HTTP_200_OK)


@api_view(["GET"])
@input_validator(["tag_label"])
def get_tagged_collections(request):
    """
    get_tagged_collections

    Gets all collections with a specified tag

    Input:
    tag_label (str)

    Returns:
    collection_list (list):
        collection_id (int)
        collection_name (str)
        collection_owner (int)
        book_list (list):
            book_id (int)
            book_title (str)
    """ 
    try:
        tag = Tag.objects.get(name=request.GET["tag_label"])
    except:
        return Response({"status": "error", "message": "Tag not found"}, status=status.HTTP_200_OK)

    collections = tag.collection_set.all()

    collection_list = []

    for collection in collections:
        curr_collection = {}
        curr_collection["collection_id"] = collection.collection_id
        curr_collection["collection_name"] = collection.name
        curr_collection["collection_owner"] = collection.user.id
        curr_collection["book_list"] = []

        curr_book = []
        for book in collection.books.all():
            curr_book = {}
            curr_book["book_id"] = book.id
            curr_book["book_title"] = book.title
            curr_collection["book_list"].append(curr_book)

        collection_list.append(curr_collection)

    return Response({"status": "ok", "message": "Got collections", "collection_list": collection_list}, status=status.HTTP_200_OK)


@api_view(["GET"])
@auth_validator
def get_similar_collections(request):
    """
    get_similar_collections

    Gets collections with similar tags to a user’s collections

    Input:
    user_id (int)

    Returns:
    collection_list (list):
        collection_id (int)
        collection_name (str)
        collection_owner (int)
        tag_match_count (int)
        tag_list (list):
            tag_name (str)
        book_list (list):
            book_id (int)
            book_title (str)

    """ 
    user: User = request.user

    # Get the tags for all collections
    tags = []
    for collection in user.collection_set.all():
        for tag in collection.tags.all():
            if tag not in tags:
                tags.append(tag)
    
    if len(tags) == 0:
        return Response({"status": "error", "message": "No tags found", "collection_list": []}, status=status.HTTP_200_OK)

    matching_collections = {}

    for tag in tags:
        collections = tag.collection_set.all()
        usr_col = user.collection_set.all()
        for collection in collections:
            collection_id = collection.collection_id
            if (collection not in usr_col) and (str(collection_id) not in matching_collections):
                # Use a dictionary to ensure we dont double up
                # book_list = []
                # for book in collection.books.all():
                #     curr_book = {}
                #     curr_book["book_id"] = book.id
                #     curr_book["book_title"] = book.title
                #     book_list.append(curr_book)

                tag_list = []
                tag_match_count = 0
                for tag in collection.tags.all():
                    tag_list.append(tag.name)
                    if tag in tags:
                        tag_match_count += 1

                matching_collections[str(collection_id)] = {
                    "collection_id": collection_id,
                    "collection_name": collection.name,
                    "collection_owner": collection.user.id,
                    "tag_match_count": tag_match_count,
                    "tag_list": tag_list,
                    # "book_list": book_list
                }

    # Flatten and return the dictionary
    return Response({"status": "ok", "message": "Got collections", "collection_list": matching_collections.values()}, status=status.HTTP_200_OK)


@api_view(["GET"])
@input_validator(["collection_id"])
def recent_added(request): # returns ten most recently added books for specified collection
    try:
        collection = Collection.objects.get(collection_id=request.GET["collection_id"])
    except:
        return Response({"status": "error", "message": "Collection not found"}, status=status.HTTP_200_OK)

    book_list = []
    order = collection.collectionbookmetadata_set.all().order_by('-time_added')
    count = 0
    for metadata in order:
        if count >= 10:
            break
        else:
            book_list.append({"id": metadata.book.id, "title": metadata.book.title})
            count += 1

    return Response({"status": "ok", "message": "Got recently added books", "book_list": book_list}, status=status.HTTP_200_OK)


