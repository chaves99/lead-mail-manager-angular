import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateResource, TemplateService } from './template.service';

@Component({
  selector: 'app-template',
  imports: [
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    FormField,
    FormRoot
  ],
  templateUrl: './template.html',
  styleUrl: './template.css'
})
export class Template implements OnInit {

  private readonly snackbar = inject(MatSnackBar);

  private readonly url = API_URL + "/template";

  templateFormSignal = signal<TemplateResource>({
    name: '',
    subject: '',
    body: '',
  });

  templateForm = form(this.templateFormSignal,
    () => { },
    {
      submission: {
        action: async (field) => {
          this.templateService.create(field().value()).subscribe({
            next: () => {
              this.templateFormSignal.set({
                name: '',
                subject: '',
                body: '',
              });
              this.templates.reload();
            }
          });
        }
      }
    });

  templates = httpResource<TemplateResource[]>(() => ({
    url: this.url,
    method: 'GET',
  }));

  private readonly templateService = inject(TemplateService);

  ngOnInit(): void {
  }

  onSelectTemplate(template: TemplateResource) {
    this.templateFormSignal.set({ ...template });
  }

  onSendTest(templateId: number): void {
    this.templateService.test(templateId).subscribe({
      next: () => {
        this.snackbar.open("Enviado", "Fechar");
      },
      error: () => {
        this.snackbar.open("Erro ao enviar", "Fechar");
      }
    });
  }

  onDelete(templateId: number): void {
    this.templateService.delete(templateId).subscribe({
      next: () => {
        this.snackbar.open("Excluido", "Fechar");
        this.templates.reload();
      },
      error: () => {
        this.snackbar.open("Erro ao excluir", "Fechar");
      }
    });
  }

}

