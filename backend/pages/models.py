from django.db import models

# initial commit - beginning work on DB object models 

# User object model
class User(models.Model):
	user_id 			= 		models.CharField(max_length=255, primary_key=True)
	first_name 		= 		models.CharField(max_length=255)
	last_name  		=  		models.CharField(max_length=255)
	phone_number 	= 		models.CharField(max_length=10) # store phone number as a chara string instead of number
	email 				= 		models.CharField(max_length=255, unique=True)
	password 			= 		models.CharField(max_length=255) # should be hashed
	# socials below
	linkedin 			= 		models.CharField(max_length=255, blank=True)
	twitter 			= 		models.CharField(max_length=255, blank=True)
	facebook 			= 		models.CharField(max_length=255, blank=True)
	verified 			= 		models.BooleanField()
	# user can have multiple addresses (Home, School, Work etc.)
	addresses = models.ManyToManyField('Address', related_name='users')

	# single achivement record
	achievement = models.OneToOneField('Achievement', on_delete=models.CASCADE, null=True, blank=True, related_name='user')  # OneToOneField to Achievement

	# Many-to-Many relationship with Badges through User_Badge bridge table
	badges = models.ManyToManyField('Badge', through='User_Badge')

class Achievement(models.Model):
	# user = models.OneToOneField(
  #   User, on_delete=models.CASCADE, related_name='achievement'
	# )  # User model (assuming it's defined elsewhere)
	quest_points = models.IntegerField()
	num_badges = models.IntegerField()
	days_active = models.IntegerField()
	num_achievements = models.IntegerField()

class AddressType(models.TextChoices):
	HOME = 'HOME', 'Home'
	WORK = 'WORK', 'Work'
	SCHOOL = 'SCHOOL', 'School'
	BILLING = 'BILLING', 'Billing'
	MAILING = 'MAILING', 'Mailing'
	OTHER = 'OTHER', 'Other'

class Address(models.Model):
	address_id 			= 		models.CharField(max_length=255, primary_key=True)
	street_address	= 		models.CharField(max_length=255)
	city 						=			models.CharField(max_length=20)
	province 				= 		models.CharField(max_length=10)
	zip_code 				= 		models.CharField(max_length=6)
	primary_address =			models.BooleanField(default=False) # flag for primary address
	address_type 		= 		models.CharField(max_length=50, choices=AddressType.choices, default=AddressType.HOME)
	# users = models.ManyToManyField('User', related_name='addresses')

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

class User_Badge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    granted_date = models.DateTimeField()
    expiry_date = models.DateTimeField(null=True, blank=True)  # Optional expiry date
    active = models.BooleanField(default=True)  # Flag for active/inactive badges






	


