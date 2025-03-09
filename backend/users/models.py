from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_team = models.JSONField(default=list, blank=True)
    easy_high_score = models.IntegerField(null=True, blank=True)
    medium_high_score = models.IntegerField(null=True, blank=True)
    hard_high_score = models.IntegerField(null=True, blank=True)

    def add_pokemon(self, pokemon_id):
        if self.current_team is None:
            self.current_team = []

        if pokemon_id not in self.current_team:
            self.current_team.append(pokemon_id)
            self.save()

    def remove_pokemon(self, pokemon_id):
        if self.current_team is None:
            self.current_team = []
            return

        if pokemon_id in self.current_team:
            self.current_team.remove(pokemon_id)
            self.save()

    def update_high_score(self, difficulty, score):
        current_score = getattr(self, f"{difficulty}_high_score")
        if current_score is None or score < current_score:  # Lower score is better
            setattr(self, f"{difficulty}_high_score", score)
            self.save()
            return True
        return False

    def __str__(self):
        return self.user.username
