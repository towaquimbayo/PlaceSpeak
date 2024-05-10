from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import User

# Create your views here.

# '/hello' route (define functions for serving different kinds of requests here)
class HelloWorldView(APIView):
  def get(self, request):
    message = "Hello, world!"
    return Response(data={'message': message})
  
class UserAPI(APIView):
    def post(self, request):
        """
        API endpoint to fetch a user's details by email address.

        Args:
            request (Request): Incoming HTTP request.

        Returns:
            Response: JSON response containing user details or error message.
        """

        # Get email from the request body (adjust key name if needed)
        try:
            user_email = request.data['email']
        except KeyError:
            return Response(
                {"error": "Missing 'email' field in request body."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return Response(
                {"error": "User with email '{}' not found.".format(user_email)},
                status=status.HTTP_404_NOT_FOUND,
            )
      
        serialized_data = {
            "id": user.user_id,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "email": user.email,
            "phone": user.phone_number,
            "password": user.password,
            "about": "Hardcoded Description here",
            "linkedIn": user.linkedin,
            "twitter": user.twitter,
            "facebook": user.facebook,
            "pfp_link": user.pfp_link,
            "verified_email": user.verified_email,
            "verified_phone": user.verified_phone,
            "verified_address": user.verified_address,

            # we can add more fields to return as required later
        }

        return Response(serialized_data, status=status.HTTP_200_OK)




class UpdateEmailVerificationStatus(APIView):
    def post(self, request, user_id):
        user = get_object_or_404(User, user_id=user_id)
        verified_email = request.data.get('verified_email')
        if verified_email is not None:
            user.verified_email = verified_email
            user.save()
            return Response({'message': 'Email verification status updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Verified email status not provided'}, status=status.HTTP_400_BAD_REQUEST)