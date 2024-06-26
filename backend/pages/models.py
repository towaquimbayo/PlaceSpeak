from django.db import models, transaction
from django.db.models import F
from django.utils import timezone

# initial commit - beginning work on DB object models 

# User object model
class User(models.Model):
	user_id 			= 		models.AutoField(primary_key=True)
	first_name 		= 		models.CharField(max_length=255)
	last_name  		=  		models.CharField(max_length=255)
	phone_number 	= 		models.CharField(max_length=10) # store phone number as a chara string instead of number
	email 				= 		models.CharField(max_length=255, unique=True)
	password 			= 		models.CharField(max_length=255) # should be hashed
	about  				=     models.CharField(max_length=255, blank=True)  # user description
	pfp_link      =     models.CharField(max_length=255, blank=True)

	# Fields for social media links
	linkedin 			= 		models.CharField(max_length=255, blank=True)
	twitter 			= 		models.CharField(max_length=255, blank=True)
	facebook 			= 		models.CharField(max_length=255, blank=True)

	# Fields for verification status
	verified_email 		= 		models.BooleanField(default=False)
	verified_phone 		= 		models.BooleanField(default=False)
	verified_address 	= 		models.BooleanField(default=False)

	# Fields for user stats
	post_count 			= 		models.IntegerField(default=0)
	comment_count 		= 		models.IntegerField(default=0)
	polls_answered_count 	= 		models.IntegerField(default=0)
	account_created		= models.DateTimeField(auto_now_add=True)

	# Invited_by field for referral system (defaults to None/null)
	invited_by = models.ForeignKey('User', on_delete=models.CASCADE, null=True, blank=True, related_name='invited_users')

	# user can have multiple addresses (Home, School, Work etc.)
	addresses = models.ManyToManyField('Address', related_name='users')

	# single achivement record
	achievement = models.OneToOneField('Achievement', on_delete=models.CASCADE, null=True, blank=True, related_name='user')  # OneToOneField to Achievement

	# Many-to-Many relationship with Badges through User_Badge bridge table
	badges = models.ManyToManyField('Badge', through='User_Badge', related_name='user_badges')

	# One user can have multiple posts, each post can have only one user
	posts_list = models.ManyToManyField('Post', related_name='users')
	comments_list = models.ManyToManyField('Comment', related_name='users')

	# fields to provide functionality for login_streak
	login_streak_start = models.DateTimeField(null=True, blank=True)
	last_logged_in = models.DateTimeField(null=True, blank=True)

	def update_login_streak(self):
		"""
		Update the login streak based on the last login time.
		If the time since the last login exceeds 24 hours, reset the streak.
		"""
		if self.last_logged_in:
				time_since_last_login = timezone.now() - self.last_logged_in
				if time_since_last_login.total_seconds() > 24 * 60 * 60:
						# Reset the streak if more than 24 hours have passed
						self.login_streak_start = timezone.now()
		else:
				# Set the streak start time if it's the first login
				self.login_streak_start = timezone.now()
		# Update the last_logged_in time to the current time
		self.last_logged_in = timezone.now()
		self.save()

	def has_badge(self, badge_name):
		"""
		Check if the user already has a badge with the given name.

		Args:
			badge_name (str): The name of the badge to check.
		
		Returns:
			bool: True if the user already has this specific badge, False otherwise
		"""
		return self.badges.filter(name=badge_name).exists()



	def isFullyVerified(self):
		return self.verified_address and self.verified_email and self.verified_phone
	
	def awardVerificationBadge(self):
		if self.isFullyVerified() and not self.has_badge("Trusted User Badge"):
			b = Badge.objects.get(name="Trusted User Badge")  # Use double quotes for model access
			ub = User_Badge.objects.create(user=self, badge=b, granted_date=timezone.now())
			ub.save()
		else:
			print("User is not fully verified, cannot award badge.")

	def update_days_active(self):
		# Get the current date
		current_date = timezone.now().date()

		# Calculate the number of days since the account was created
		days_active = (current_date - self.account_created.date()).days + 1

		# Update the days_active field in the achievement record
		if self.achievement:
				self.achievement.days_active = days_active
				self.achievement.save(update_fields=['days_active'])
		
	def update_num_badges(self):
		# get the current number of badges that the user has
		if self.achievement:
			self.achievement.num_badges = self.badges.count()
			self.achievement.save(update_fields=['num_badges'])

	def update_num_achievements(self):
		if self.achievement:
			self.achievement.num_achievements = self.badges.count()  # Adjust logic as needed
			self.achievement.save(update_fields=['num_achievements'])

	# function that groups all updates into one, (make sure all records are consistent at login)
	def update_user_record(self):
		self.update_num_achievements()
		self.update_days_active()
		self.update_num_badges()

		self.update_login_streak()



	def award_points(self, points):
		self.achievement.quest_points = F('quest_points') + points
		self.achievement.save(update_fields=['quest_points'])

	def awardBadge(self, name):
		b = Badge.objects.get(name=name)
		ub = User_Badge.objects.create(user=self, badge=b, granted_date=timezone.now())

	def getAllBadges(self):
		user_badges = list(self.badges.all())
		# print(user_badges)
		return user_badges
	
	def getAllAddresses(self):
		user_addresses = list(self.addresses.all())
		# print(user_badges)
		return user_addresses
	
	def primaryAddress(self):
		return self.addresses.filter(primaryAddress=True).first()


	def add_address(self, name, street_address, city, country, province, zip_code, suite, primary_address=False, property_type=None, ownership_type=None):
		"""
		Adds a new address to the user's addresses.

		Args:
				street_address (str): The street address of the user.
				city (str): The city of the user's address.
				province (str): The province of the user's address.
				zip_code (str): The zip code of the user's address.
				primary_address (bool, optional): Flag indicating if it's the primary address. Defaults to False.
				property_type (models.TextChoices, optional): The type of address (e.g., HOME, WORK). Defaults to None.
		"""
		address = Address.objects.create(
				name=name,
				street=street_address,
				city=city,
				country=country,
				province=province,
				postalCode=zip_code,
		)

		if property_type:
			address.propertyType = property_type

		if ownership_type:
			address.ownershipType = ownership_type

		if primary_address:
				address.primaryAddress = True  # Set primary address flag

        # Ensure only one primary address exists by unsetting primary_address for other addresses
				self.addresses.filter(primaryAddress=True).update(primaryAddress=False)

		address.save()  # Save the address object after setting primary_address

		self.addresses.add(address)


		return address
	
	def delete_address(self, address_id):
		try:
			with transaction.atomic():
				address_to_delete = self.addresses.get(pk=address_id)
				is_primary = address_to_delete.primaryAddress

				# remove the address from the user's addresses
				self.addresses.remove(address_to_delete)
				address_to_delete.delete()

				# if the deleted address was primary, set the next available address as the primary address
				if is_primary:
					next_address = self.addresses.first()
					if next_address:
						next_address.primaryAddress = True
						next_address.save()

				return "Address deleted successfully"
		except Address.DoesNotExist:
			return "Address does not exist"
		except Exception as e:
			return str(e)

	def change_primary_address(self, new_primary_address_id):
		try:
			with transaction.atomic():
				# find the new primary address (it has to belong to the user)
				new_primary_address = self.addresses.get(pk=new_primary_address_id)

				# unset the current primary address
				current_primary_address = self.addresses.filter(primaryAddress=True).first()
				if current_primary_address:
					current_primary_address.primaryAddress = False
					current_primary_address.save()
				
				# Set the new primary address
				new_primary_address.primaryAddress = True
				new_primary_address.save()

				return "Primary Address changed successfully"
		except Address.DoesNotExist:
			return "New primary address does not exist"
		except Exception as e:
			return str(e)

				
	
	def __str__(self):
		return f"{self.first_name} {self.last_name} ({self.email}, pfp_link: {self.pfp_link})"
	
class Comment(models.Model):
  comment_id = models.AutoField(primary_key=True)
  content = models.TextField()  # Use TextField for larger text content
  upvoted_by = models.ManyToManyField(User, related_name='upvoted_comments', blank=True)
  downvoted_by = models.ManyToManyField(User, related_name='downvoted_comments', blank=True)
  created_date = models.DateTimeField(auto_now_add=True)  # Automatically set creation date

  # Foreign key to User model
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
  post_id = models.IntegerField(default=0)

class Post(models.Model):
	post_id = models.AutoField(primary_key=True)
	title = models.CharField(max_length=255)
	content = models.TextField()
	upvoted_by = models.ManyToManyField(User, related_name='upvoted_posts', blank=True)
	downvoted_by = models.ManyToManyField(User, related_name='downvoted_posts', blank=True)
	created_date = models.DateTimeField(auto_now_add=True)

	# Foreign key to User model
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')

	# One post can have multiple comments, each comment can have only one post
	comments = models.ManyToManyField(Comment, related_name='posts')


class Achievement(models.Model):
	# user = models.OneToOneField(
  #   User, on_delete=models.CASCADE, related_name='achievement'
	# )  # User model (assuming it's defined elsewhere)
	quest_points = models.IntegerField()
	num_badges = models.IntegerField()
	days_active = models.IntegerField()
	num_achievements = models.IntegerField()

class PropertyType(models.TextChoices):
	HOME = 'HOME', 'Home'
	WORK = 'WORK', 'Work'
	RECREATIONAL = 'RECREATIONAL', 'Recreational'
	INVESTMENT = 'INVESTMENT', 'Investment'
	MANAGEMENT = 'MANAGEMENT', 'Management'

class OwnershipType(models.TextChoices):
	RENT = 'RENT', 'Rent'
	OWN = 'OWN', 'Own'
	MANAGE = 'MANAGE', 'Manage'

class Address(models.Model):
	address_id 			= 		models.AutoField(primary_key=True)
	name 						= 		models.CharField(max_length=127)
	country					= 		models.CharField(max_length=32)
	street					= 		models.CharField(max_length=255)
	city 						=			models.CharField(max_length=20)
	province 				= 		models.CharField(max_length=20)
	postalCode 				= 		models.CharField(max_length=10)
	primaryAddress =			models.BooleanField(default=False) # flag for primary address
	propertyType 		= 		models.CharField(max_length=50, choices=PropertyType.choices, blank=True, null=True)
	ownershipType = models.CharField(max_length=50, choices=OwnershipType.choices, blank=True, null=True)
	# New field for APT/Suite
	suite = models.CharField(max_length=50, blank=True, null=True)


	def __str__(self) -> str:
		return f"{self.street}, {self.city}, {self.province}"

class Badge(models.Model):
		badge_id = models.AutoField(primary_key=True)  # Assuming auto-incrementing primary key
		name = models.CharField(max_length=255)
		img_link = models.CharField(max_length=255)
		rarity = models.CharField(max_length=255)
		description = models.CharField(max_length=255)
		points = models.IntegerField()
		category = models.CharField(max_length=255)

		# Many-to-Many relationship with Users through User_Badge bridge table
		users = models.ManyToManyField(User, through='User_Badge')

		def __str__(self) -> str:
			return f"{self.name}, {self.points}, {self.category}"
		


class User_Badge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    granted_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    expiry_date = models.DateTimeField(null=True, blank=True)  # Optional expiry date
    active = models.BooleanField(default=True)  # Flag for active/inactive badges


