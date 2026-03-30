import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface ScenarioResponse {
  success: boolean;
  message?: string;
  summary?: string;
  emailPreviewUrl?: string;
  error?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OpenClaw Demo';
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  selectedFile: File | null = null;
  result: ScenarioResponse | null = null;
  error: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  triggerScenario() {
    if (!this.selectedFile) {
      this.error = 'Please select a PDF file first.';
      return;
    }

    this.loading = true;
    this.result = null;
    this.error = null;
    this.cdr.detectChanges();

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<ScenarioResponse>('http://localhost:3000/scenario/trigger', formData)
      .subscribe({
        next: (resp) => {
          this.loading = false;
          if (resp.success) {
            this.result = resp;
          } else {
            this.error = resp.error || 'Unknown error occurred.';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || err.message || 'Server error';
          this.cdr.detectChanges();
        }
      });
  }
}
