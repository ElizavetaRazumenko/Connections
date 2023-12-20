import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GroupData } from 'src/app/redux/models/group.model';
import { GroupService } from '../../services/group.service';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {
  public currentUserId = localStorage.getItem('uid')
    ? localStorage.getItem('uid')
    : '';
  @Input() public groupList!: GroupData;

  public currentTheme =
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'ligth';

  constructor(
    private GroupServise: GroupService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  public prepareForDeliting(event: MouseEvent) {
    this.GroupServise.setDelitionGroupId(this.groupList.id);
    this.GroupServise.toTheGroupDeletionMode();
    event.stopPropagation();
  }

  public toTheGroupDialog() {
    this.router.navigate([`/group/${this.groupList.id}`]);
  }
}
