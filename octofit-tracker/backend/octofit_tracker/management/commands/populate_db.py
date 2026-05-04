from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    class Meta:
        app_label = 'octofit_tracker'

class Activity(models.Model):
    user = models.CharField(max_length=100)
    activity_type = models.CharField(max_length=100)
    duration = models.IntegerField()
    team = models.CharField(max_length=100)
    class Meta:
        app_label = 'octofit_tracker'

class Leaderboard(models.Model):
    team = models.CharField(max_length=100)
    points = models.IntegerField()
    class Meta:
        app_label = 'octofit_tracker'

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    difficulty = models.CharField(max_length=50)
    class Meta:
        app_label = 'octofit_tracker'

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        # Usuń istniejące dane
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Dodaj drużyny
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Dodaj użytkowników
        ironman = User.objects.create_user(username='ironman', email='ironman@marvel.com', password='pass')
        batman = User.objects.create_user(username='batman', email='batman@dc.com', password='pass')
        spiderman = User.objects.create_user(username='spiderman', email='spiderman@marvel.com', password='pass')
        superman = User.objects.create_user(username='superman', email='superman@dc.com', password='pass')

        # Dodaj aktywności
        Activity.objects.create(user='ironman', activity_type='run', duration=30, team='Marvel')
        Activity.objects.create(user='batman', activity_type='cycle', duration=45, team='DC')
        Activity.objects.create(user='spiderman', activity_type='swim', duration=25, team='Marvel')
        Activity.objects.create(user='superman', activity_type='fly', duration=60, team='DC')

        # Dodaj leaderboard
        Leaderboard.objects.create(team='Marvel', points=55)
        Leaderboard.objects.create(team='DC', points=105)

        # Dodaj treningi
        Workout.objects.create(name='Hero HIIT', description='Intensywny trening interwałowy', difficulty='hard')
        Workout.objects.create(name='Power Yoga', description='Joga dla superbohaterów', difficulty='medium')

        self.stdout.write(self.style.SUCCESS('Baza octofit_db została wypełniona przykładowymi danymi.'))
