import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
// Template-driven form.
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      // Opslaan ingevoerde gegevens
      const savedForm = window.localStorage.getItem('saved-login-form');
      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        const savedEmail = loadedFormData.email;
        // workaround omdat de controls nog niet geinitialiseerd zijn
        setTimeout(() => {
          this.form().controls['email'].setValue(savedEmail);
        })
      }

      // valueChanges observable
      const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
        // next: (value) => console.log(value)
        next: (value) => window.localStorage.setItem('saved-login-form', JSON.stringify({ email: value.email }) // application tab
        )
      }); 
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }
    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;
    console.log(`Email: ${enteredEmail} Password: ${enteredPassword}`);
    console.log(formData.form);

    formData.form.reset();
  }
}
