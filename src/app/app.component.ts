import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project';

  onOverlayActivate(cmp: any) {
  console.log('✅ OVERLAY OUTLET ACTIVATED:', cmp?.constructor?.name);
}
}
