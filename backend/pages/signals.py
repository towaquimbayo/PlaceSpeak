from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User_Badge, User, Achievement, Badge, Address

@receiver(post_save, sender=User_Badge)
def update_achievement(sender, instance, created, **kwargs):
	if created:
		print("updating the badges")
		user = instance.user
		badge = instance.badge
		user.update_num_badges()
		user.update_num_achievements()
		
		if user.achievement and badge:
			user.achievement.quest_points += badge.points
			user.achievement.save(update_fields=['quest_points'])

@receiver(post_save, sender=User)
def create_user_achievement(sender, instance, created, **kwargs):
	if created:
		achievement = Achievement.objects.create(
				quest_points=0,
				num_badges=0,
				days_active=0,
				num_achievements=0
		)
		instance.achievement = achievement
		instance.save()

@receiver(post_save, sender=Address)
def update_user_quest_points_on_address_creation(sender, instance, created, **kwargs):
	if created:
		user = instance.users.first()  # Assuming an address can belong to multiple users, and we're just picking the first one
		if user and user.achievement:
				user.achievement.quest_points += 200
				user.achievement.save(update_fields=['quest_points'])