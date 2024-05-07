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
	addresses 		= 		models.ManyToManyField('Address')

	achievement = models.OneToOneField('Achievement', on_delete=models.CASCADE, null=True, blank=True)  # OneToOneField to Achievement

class Achievement(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)  # User model (assuming it's defined elsewhere)
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







	


