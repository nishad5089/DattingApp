import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { Routes } from '@angular/router';
import { MemeberDetailComponent } from './members/memeber-detail/memeber-detail.component';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'messages', component: MessagesComponent},
            { path: 'members/:id', component: MemeberDetailComponent, resolve: {user : MemberDetailResolver} },
            { path: 'member/edit', component: MemberEditComponent,
            resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsavedChanges] },
            { path: 'members', component: MemberListComponent,  resolve: {users : MemberListResolver}},
            { path: 'lists', component: ListsComponent},
            { path: '**', component: HomeComponent, pathMatch: 'full'},
        ]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
