import { Component, OnInit } from '@angular/core';
import { elementAt } from 'rxjs';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html'
})
export class AccountSettingsComponent implements OnInit {


  constructor(private settingService : SettingService) { }

  ngOnInit(): void {
    this.settingService.checkCurrentTheme();
  }

  changeTheme(theme: string) {
    this.settingService.changeTheme(theme);
  }
}
