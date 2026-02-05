import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent {
  person = {
    name: 'Chen Cohen',
    id: 'xxxxxxxxxx',
    role: 'Angular Developer',
    bio: 'npx json-server --watch users.json --port 3001',
    email: 'chen@example.com',
    avatarUrl: 'profile.png'
  };
}