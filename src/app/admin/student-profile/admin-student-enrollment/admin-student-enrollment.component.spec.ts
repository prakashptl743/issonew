import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminStudentEnrollmentComponent } from "./admin-student-enrollment.component";

describe("AdminStudentEnrollmentComponent", () => {
  let component: AdminStudentEnrollmentComponent;
  let fixture: ComponentFixture<AdminStudentEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminStudentEnrollmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStudentEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
