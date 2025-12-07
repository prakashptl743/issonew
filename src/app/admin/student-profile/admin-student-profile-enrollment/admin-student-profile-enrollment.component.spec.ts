import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminStudentProfileEnrollmentComponent } from "./admin-student-profile-enrollment.component";

describe("AdminStudentProfileEnrollmentComponent", () => {
  let component: AdminStudentProfileEnrollmentComponent;
  let fixture: ComponentFixture<AdminStudentProfileEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminStudentProfileEnrollmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStudentProfileEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
