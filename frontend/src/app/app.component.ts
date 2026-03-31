import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OpenClaw Demo';
  private readonly apiBaseUrl = 'http://localhost:3000';
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  loadingPdf = false;
  loadingText = false;
  selectedFile: File | null = null;
  textToSummarize = '';
  lastAction: 'pdf' | 'text' | null = null;
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

    this.loadingPdf = true;
    this.lastAction = 'pdf';
    this.result = null;
    this.error = null;
    this.cdr.detectChanges();

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<ScenarioResponse>(`${this.apiBaseUrl}/scenario/trigger`, formData)
      .subscribe({
        next: (resp) => {
          this.loadingPdf = false;
          if (resp.success) {
            this.result = resp;
          } else {
            this.error = resp.error || 'Unknown error occurred.';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loadingPdf = false;
          this.error = err.error?.error || err.message || 'Server error';
          this.cdr.detectChanges();
        }
      });
  }

  triggerTextSummarization() {
    if (!this.textToSummarize.trim()) {
      this.error = 'Please enter some text to summarize.';
      return;
    }

    this.loadingText = true;
    this.lastAction = 'text';
    this.result = null;
    this.error = null;
    this.cdr.detectChanges();

    this.http
      .post<ScenarioResponse>(`${this.apiBaseUrl}/scenario/summarize-text`, {
        text: this.textToSummarize,
      })
      .subscribe({
        next: (resp) => {
          this.loadingText = false;
          if (resp.success) {
            this.result = resp;
          } else {
            this.error = resp.error || 'Unknown error occurred.';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loadingText = false;
          this.error = err.error?.error || err.message || 'Server error';
          this.cdr.detectChanges();
        },
      });
  }
}
