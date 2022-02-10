# Authentication handler

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .utilities import auth_validator, input_validator

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from .models import Profile


@api_view(["POST"])
@input_validator(["email", "first_name", "last_name", "password"])
def signup(request):
    """
    signup

    Stored as regular user but we just always make username = email

    Input:
    email (str)
    first_name (str)
    last_name (str)
    password (str)

    Returns:
    token (str)
    """
    # Check that the email (username) is unique
    if User.objects.filter(username=request.POST["email"]).exists():
        return Response({"status": "error", "message": "Username already taken"}, status=status.HTTP_409_CONFLICT)

    # Create the user object and set the data fields
    user = User.objects.create_user(
        request.POST["email"], first_name=request.POST["first_name"], last_name=request.POST["last_name"], email=request.POST["email"])
    user_id = user.id
    user.set_password(request.POST["password"])
    user.save()

    # Get the token
    token, _ = Token.objects.get_or_create(user=user)

    return Response({"status": "ok", "message": "User Successfully Created", "user_id": user_id, "token": token.key}, status=status.HTTP_200_OK)


@api_view(["POST"])
@input_validator(["email", "password"])
def signin(request):
    """
    signin

    Return a token

    Input:
    email (str)
    password (str)

    Returns:
    token (str)
    """
    # Try to log in and generate/get a token
    user = authenticate(
        request, username=request.POST["email"], password=request.POST["password"])
    if user is not None:
        user_id = user.id
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"status": "ok", "message": "User successfully logged in", "user_id": user_id, "token": token.key}, status=status.HTTP_200_OK)
    else:
        return Response({"status": "error", "message": "Could not log in"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
@auth_validator
def signout(request):
    """
    signout

    Signs a user out
    Requires auth token

    Input:
    nothing

    Returns:
    nothing
    """
    request.user.auth_token.delete()
    return Response({"status": "ok", "message": "User successfully logged out"}, status=status.HTTP_200_OK)
