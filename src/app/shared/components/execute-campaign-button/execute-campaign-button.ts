import { Component, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CampaignExecution, CampaignService } from '../../../feature/campaign/campaign.service';
import { EmailSearchFilter } from '../../../feature/email-search/email-search';
import { TemplateResource, TemplateService } from '../../../feature/template';

@Component({
  selector: 'app-execute-campaign-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './execute-campaign-button.html',
  styleUrl: './execute-campaign-button.css',
})
export class ExecuteCampaignButton {

  filter = input<EmailSearchFilter>();

  private readonly templateDialog = inject(MatDialog);
  private readonly snackbarService = inject(MatSnackBar);
  private readonly templateService = inject(TemplateService);
  private readonly campaignService = inject(CampaignService);

  templatesFetch = this.templateService.fetch();

  onExecuteCampaign() {
    const templates = this.templatesFetch.value();
    this.templateDialog.open(TemplateDialogComponent, {
      data: templates,
      width: '350px'
    }).afterClosed().subscribe(value => {
      const filter = this.filter();
      if (value !== undefined && value.templateId && value.description && filter) {
        const request: CampaignExecution = {
          templateId: value.templateId,
          description: value.description,
          limit: value.limit,
          filter: filter,
        };
        this.campaignService.executeCampaign(request).subscribe({
          next: () => this.snackbarService.open("Sucesso ao agendar emails", "Fechar"),
          error: () => this.snackbarService.open("Erro ao agendar emails", "Fechar")
        });
      }
    });
  }
}

@Component({
  selector: 'company-template-dialog',
  template: `
    <h2 mat-dialog-title>Campaign Details</h2>
    <mat-dialog-content>
      <mat-form-field style="width: 100%">
        <mat-label>Description</mat-label>
        <input matInput placeholder="black_friday" [(ngModel)]="description">
      </mat-form-field>

      <mat-form-field style="width: 100%">
        <mat-label>Max Number of Limit</mat-label>
        <input matInput type="number" placeholder="30" [(ngModel)]="limit">
      </mat-form-field>


      <mat-form-field style="margin-top: 20px; width: 100%;">
        <mat-label>Templates</mat-label>
        <mat-select [(ngModel)]="templateId">
        @for(t of data; track t) {
          <mat-option [value]="t.id">{{ t.name }}</mat-option>
        }
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton (click)="onNoClick()">
        Cancel
      </button>
      <button matButton (click)="onConfirm()">
        Confirm
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatDialogContent,
    MatInputModule,
    MatDialogTitle,
    MatDialogActions
  ],
})
export class TemplateDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TemplateDialogComponent>);
  readonly data = inject<TemplateResource[]>(MAT_DIALOG_DATA);

  private readonly snackbar = inject(MatSnackBar);

  templateId = model<number>();
  description = model<string>();
  limit = model<number>();

  onConfirm(): void {
    const templateId = this.templateId();
    const desc = this.description();
    if (templateId && templateId > 0 && desc && desc.length > 0)
      this.dialogRef.close({ description: this.description(), templateId: this.templateId(), limit: this.limit() });
    else {
      this.snackbar.open("Todos os campos são obrigatórios!", "Fechar", { duration: 6 * 1000 })
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
