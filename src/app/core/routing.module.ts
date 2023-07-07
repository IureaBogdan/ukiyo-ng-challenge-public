import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout/layout.component';

/**
 * App centralized redirect path.
 *
 * @date 7/4/2023 - 5:11:03 PM
 */
const REDIRECT_TO = {
  redirectTo: '/challenge',
};

/**
 * App core routes.
 *
 * @date 7/4/2023 - 5:13:27 PM
 */
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    ...REDIRECT_TO,
  },
  {
    path: '',
    // Use Layout component as an wrapping element for the app features.
    component: LayoutComponent,
    children: [
      {
        path: 'challenge',
        // Lazy load application feature module.
        loadChildren: () =>
          import('../features/challenge/challenge.module').then(
            (m) => m.ChallengeModule
          ),
      },
    ],
  },
  {
    path: '**',
    ...REDIRECT_TO,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
