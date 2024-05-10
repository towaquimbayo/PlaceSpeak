import datetime
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import User, Badge, User_Badge

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
    
class UpdateUserAPI(APIView):
    def post(self, request):
        """
        API endpoint to update a user's details.

        Args:
            request (Request): Incoming HTTP request containing user details in JSON format.

        Returns:
            Response: JSON response with success message or error details.
        """

        try:
            # Validate request data as a dictionary
            user_data = request.data

        except (TypeError, ValueError):
            return Response({'error': 'Request body must be valid JSON.'})

        # Check for required fields
        required_fields = ['firstName', 'lastName', 'email', 'phone', 'about', 'linkedIn', 'twitter', 'facebook']
        missing_fields = [field for field in required_fields if field not in user_data]
        if missing_fields:
            return Response({'error': f"Missing required fields: {', '.join(missing_fields)}"})

        # Hardcoded user ID for demonstration (replace with appropriate logic)
        user_id = 1

        try:
            user = User.objects.get(pk=user_id)  # Use primary key (pk) for retrieval
        except User.DoesNotExist:
            return Response(
                {'error': f"User with ID {user_id} does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Update user fields with data from request
        user.first_name = user_data['firstName']
        user.last_name = user_data['lastName']
        user.email = user_data['email']  # Update email if allowed (security considerations)
        user.phone_number = user_data['phone']
        user.about = user_data['about']
        user.linkedin = user_data['linkedIn']
        user.twitter = user_data['twitter']
        user.facebook = user_data['facebook']
        # Update other relevant fields as needed

        user.save()  # Save changes to the database

        return Response({'message': 'User details updated successfully.'}, status=status.HTTP_200_OK)



"""
UpdateEmailVerificationStatus class

This class is used to update the email verification status of a user.
"""
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

"""
UpdatePhoneVerificationStatus class

This class is used to update the phone verification status of a user.
"""
class UpdatePhoneVerificationStatus(APIView):
    def post(self, request, user_id):
        user = get_object_or_404(User, user_id=user_id)
        verified_phone = request.data.get('verified_phone')
        if verified_phone is not None:
            user.verified_phone = verified_phone
            user.save()
            return Response({'message': 'Phone verification status updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Verified phone status not provided'}, status=status.HTTP_400_BAD_REQUEST)


"""
UpdateAddressVerificationStatus class

This class is used to update the address verification status of a user.
"""
class UpdateAddressVerificationStatus(APIView):
    def post(self, request, user_id):
        user = get_object_or_404(User, user_id=user_id)
        verified_address = request.data.get('verified_address')
        if verified_address is not None:
            user.verified_address = verified_address
            user.save()
            return Response({'message': 'Address verification status updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Verified address status not provided'}, status=status.HTTP_400_BAD_REQUEST)
        

class PopulateBadges(APIView):
    def post(self, request):
        try:
            # Inquirer Badge
            inquirer_badge = Badge.objects.create(
                name="Inquirer Badge",
                img_link="inquirer_badge_img_link",
                rarity="Common",
                description="Awarded after their first insightful comment or question. This badge acknowledges the initiation into the realm of discussions.",
                points=100,  # Set appropriate points
                category="Discussion"
            )
            # New Voice Badge
            new_voice_badge = Badge.objects.create(
                name="New Voice Badge",
                img_link="new_voice_badge_img_link",
                rarity="Common",
                description="Celebrating your inaugural participation! This badge acknowledges your initial step in voicing your opinion and contributing to the community's collective decision-making. As a 'New Voice,' you've begun your journey in shaping our neighborhood's future.",
                points=100,  # Set appropriate points
                category="Participation"
            )
            # Welcoming Whisperer Badge
            welcoming_whisperer_badge = Badge.objects.create(
                name="Welcoming Whisperer Badge",
                img_link="welcoming_whisperer_badge_img_link",
                rarity="Rare",
                description="For inviting their first neighbor to PlaceSpeak to participate in a poll or discussion.",
                points=200,  # Set appropriate points
                category="Engagement"
            )
            # Trusted Neighbour Badge
            trusted_neighbour_badge = Badge.objects.create(
                name="Trusted Neighbour Badge",
                img_link="trusted_neighbour_badge_img_link",
                rarity="Epic",
                description="This badge signifies that a user's identity and address have been verified, enhancing the trustworthiness and authenticity of their contributions. As a Trusted Neighbor, their commitment to genuine engagement strengthens the integrity and reliability of our civic community platform.",
                points=500,  # Set appropriate points
                category="Verification"
            )
            # Legacy Citizen Badge
            legacy_citizen_badge = Badge.objects.create(
                name="Legacy Citizen Badge",
                img_link="legacy_citizen_badge_img_link",
                rarity="Legendary",
                description="Long-time users consistently participating over the years. Their stories and contributions become legendary within the community.",
                points=1000,  # Set appropriate points
                category="Participation"
            )
            # New Neighbour Badge
            new_neighbour_badge = Badge.objects.create(
                name="New Neighbour Badge",
                img_link="new_neighbour_badge_img_link",
                rarity="Common",
                description="Awarded to those who have recently joined Placespeak. This badge recognizes newcomers and encourages them to dive into discussions, share their thoughts, and become active participants in shaping our neighbourhood's future.",
                points=100,  # Set appropriate points
                category="Participation"
            )

            # TODO: Associate the badge with the user by creating User_Badge instances

            # Example: Get users who meet the condition for Inquirer Badge
            # inquirer_badge_users = User.objects.filter(
            #     # Add your condition logic here
            # )

            # Example: Associate Inquirer Badge with users
            # for user in inquirer_badge_users:
            #     User_Badge.objects.create(
            #         user=user,
            #         badge=inquirer_badge
            #     )

            # Repeat the above process for each badge

            return Response({"message": "Badges populated successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyTrustedNeighbourBadge(APIView):
    def post(self, request, user_id):
        try:
            # Retrieve the user object based on the user_id
            user = User.objects.get(id=user_id)

            # Check if the user's identity and address have been verified
            if user.verified_email and user.verified_phone and user.verified_address:
                # Create or update User_Badge entry for Trusted Neighbour Badge
                trusted_neighbour_badge = Badge.objects.get(name="Trusted Neighbour Badge") # Assuming the badge already exists
                user_badge, created = User_Badge.objects.get_or_create(user=user, badge=trusted_neighbour_badge)

                # Set the granted date of the badge
                user_badge.granted_date = datetime.now()
                user_badge.save()

                return Response({"message": "User meets the requirements for Trusted Neighbour Badge", "badge_granted": created}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "User does not meet the requirements for Trusted Neighbour Badge"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
