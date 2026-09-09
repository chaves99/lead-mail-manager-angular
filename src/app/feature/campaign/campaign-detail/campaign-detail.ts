import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-campaign-detail',
  imports: [],
  templateUrl: './campaign-detail.html',
})
export class CampaignDetail implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(value => {
      const id = value['id'];
    })
  }

}
