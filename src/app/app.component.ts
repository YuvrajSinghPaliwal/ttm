import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component'; // Import HeaderComponent
import { FooterComponent } from './shared/components/footer/footer.component'; // Import FooterComponent

@Component({
  selector: 'app-root',
  standalone: true,
  //imports: [CommonModule, RouterOutlet],
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'railway-portal';
}
