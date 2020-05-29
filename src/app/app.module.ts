import { AuthGuardService } from './guard/authGuard.service';
import { AuthService } from './services/auth.service';
import { SearchQuestService } from './services/searchQuest.service';
import { PermissionService } from './services/permission.service';
import { SearchService } from './services/search.service';
import { QuestService } from './services/quest.service';
import { AnswerService } from './services/answer.service';
import { CityService } from './services/city.service';
import { InterviewService } from './services/interview.service';
import { HttpInterceptorRequest } from './auth/interceptor.module';
import { GlobalVariables, GlobalFunctions } from './global';
import { UserService } from './services/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { ModalSearchComponent } from './modal/modal-interview/modal-interview.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalPutUserComponent } from './modal/modal-put-user/modal-put-user.component';
import { ModalPutSearchComponent } from './modal/modal-put-search/modal-put-search.component';
import { ModalPutQuestComponent } from './modal/modal-put-quest/modal-put-quest.component';
import { ModalPutCityComponent } from './modal/modal-put-city/modal-put-city.component';
import { ModalPutPasswordComponent } from './modal/modal-put-password/modal-put-password.component';
import { ModalConfirmComponent } from './modal/modal-confirm/modal-confirm.component';
import { FileSaverModule } from 'ngx-filesaver';
import { RegisterQuestComponent } from './pages/register-quest/register-quest.component';
import { ModalFilterInterviewsComponent } from './modal/modal-filter-interviews/modal-filter-interviews.component';
import { ModalInfoInterviewComponent } from './modal/modal-info-interview/modal-info-interview.component';
import { ModalLoadingComponent } from './modal/modal-loading/modal-loading.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    }),
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,
    FileSaverModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    ModalSearchComponent,
    ModalPutUserComponent,
    ModalPutSearchComponent,
    ModalPutQuestComponent,
    ModalPutCityComponent,
    ModalPutPasswordComponent,
    ModalConfirmComponent,
    RegisterQuestComponent,
    ModalFilterInterviewsComponent,
    ModalInfoInterviewComponent,
    ModalLoadingComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorRequest,
      multi: true
    },
    GlobalVariables,
    GlobalFunctions,
    AnswerService,
    AuthService,
    AuthGuardService,
    CityService,
    InterviewService,
    PermissionService,
    QuestService,
    SearchService,
    SearchQuestService,
    UserService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
