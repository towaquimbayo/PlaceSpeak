from django.db import models
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

	def isFullyVerified(self):
		return self.verified_address and self.verified_email and self.verified_phone
	
	def awardVerificationBadge(self):
		if self.isFullyVerified():
			b = Badge.objects.get(badge_id=1)  # Use double quotes for model access
			ub = User_Badge.objects.create(user=self, badge=b, granted_date=timezone.now())
			ub.save()
		else:
			print("User is not fully verified, cannot award badge.")

	def awardBadge(self, name):
		b = Badge.objects.get(name=name)
		ub = User_Badge.objects.create(user=self, badge=b, granted_date=timezone.now())

	def getAllBadges(self):
		user_badges = list(self.badges.all())
		# print(user_badges)
		return user_badges
	
	def primaryAddress(self):
		return self.addresses.filter(primary_address=True).first()


	def add_address(self, street_address, city, province, zip_code, primary_address=False, address_type=None):
		"""
		Adds a new address to the user's addresses.

		Args:
				street_address (str): The street address of the user.
				city (str): The city of the user's address.
				province (str): The province of the user's address.
				zip_code (str): The zip code of the user's address.
				primary_address (bool, optional): Flag indicating if it's the primary address. Defaults to False.
				address_type (models.TextChoices, optional): The type of address (e.g., HOME, WORK). Defaults to None.
		"""
		address = Address.objects.create(
				street_address=street_address,
				city=city,
				province=province,
				zip_code=zip_code,
		)

		if address_type:
			address.address_type = address_type

		self.addresses.add(address)

		if primary_address:
			self.addresses.set([address])  # Set the primary address

		return address
	
	def __str__(self):
		return f"{self.first_name} {self.last_name} ({self.email}, pfp_link: {self.pfp_link})"
	
class Comment(models.Model):
  comment_id = models.AutoField(primary_key=True)
  content = models.TextField()  # Use TextField for larger text content
  upvotes = models.IntegerField(default=0)
  downvotes = models.IntegerField(default=0)
  created_date = models.DateTimeField(auto_now_add=True)  # Automatically set creation date

  # Foreign key to User model
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
  post_id = models.IntegerField(default=0)

class Post(models.Model):
	post_id = models.AutoField(primary_key=True)
	title = models.CharField(max_length=255)
	content = models.TextField()
	upvotes = models.IntegerField(default=0)
	downvotes = models.IntegerField(default=0)
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
	street_address	= 		models.CharField(max_length=255)
	city 						=			models.CharField(max_length=20)
	province 				= 		models.CharField(max_length=10)
	zip_code 				= 		models.CharField(max_length=6)
	primary_address =			models.BooleanField(default=False) # flag for primary address
	property_type 		= 		models.CharField(max_length=50, choices=PropertyType.choices, blank=True, null=True)
	ownership_type = models.CharField(max_length=50, choices=OwnershipType.choices, blank=True, null=True)
	# New field for APT/Suite
	apt_suite = models.CharField(max_length=50, blank=True, null=True)


	def __str__(self) -> str:
		return f"{self.street_address}, {self.city}, {self.province}"

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


