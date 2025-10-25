import { Component, createPlatform, OnInit } from "@angular/core";
import { ConfirmationService, SelectItem } from "primeng/api";
import { IssoUtilService } from "src/app/services/isso-util.service";

import { MessageService } from "primeng/api";
import { ReportMeritService } from "../../service/report-merit.service";
import { AdminStudentProfileService } from "../../service/admin-student-profile.service";
import { ParentDashboardService } from "../../service/parent-dashboard.service";

@Component({
  selector: "app-manual-paymnet",
  templateUrl: "./manual-paymnet.component.html",
  styleUrls: ["./manual-paymnet.component.css"],
  providers: [MessageService, ConfirmationService],
})
export class ManualPaymentComponent implements OnInit {
  isLoading: boolean = false;
  yearOptions: SelectItem[];
  eventOptions: SelectItem[];
  gameOptions: SelectItem[];
  schoolOptions: SelectItem[];
  ageOptions: SelectItem[];
  genderOptions: SelectItem[];
  studentAttendanceArray = [];
  studentAbsentArray = [];
  attendanceArray = [];

  gameIdList: any;
  gameNameList: any;
  myObjArray: any;

  eventValue: number;
  yearvalue: number;
  schoolvalue: number;
  eventData: any;
  schoolDataArray = [];
  eventReadable: boolean = false;
  gameReadble: boolean = false;
  schoolReadble: boolean = false;
  selectedEvent: string;
  schoolList: any;
  gameList: any;
  public gameID: number;
  public schoolID: any;

  reportData: any;

  isDataAvailble: boolean = false;
  schooName: string;

  showspinner: boolean = false;
  reportDataLength: number;
  selectedGame: string;
  selectedSchool: string;
  selectedYear: string;

  isConsolited: boolean;

  consolateFileName: any;
  gameType: any;
  selectedYearVal: string;
  studentAttendance: boolean;

  gameArray = [];

  constructor(
    private issoUtilService: IssoUtilService,
    private messageService: MessageService,
    private meritService: ReportMeritService,
    private parentDashboardService: ParentDashboardService,
    private adminStudentProfileService: AdminStudentProfileService
  ) {}

  ngOnInit() {
    this.isDataAvailble = false;
    this.yearOptions = this.issoUtilService.studentProfileYear();
  }
  onyeareChange(event) {
    this.studentAttendanceArray = [];
    this.studentAbsentArray = [];
    this.yearvalue = event.value;
    this.meritService.loadEventByYearForReport(this.yearvalue, 0).subscribe(
      (response) => {
        if (response !== "") {
          this.eventData = response;
          this.gameReadble = false;
          this.schoolReadble = false;
          if (this.eventData.length > 0) {
            this.eventOptions = [];
            this.eventReadable = true;
            this.isDataAvailble = false;
            this.eventOptions.push({
              label: "Please Select",
              value: "",
            });
            this.eventData.forEach((element) => {
              this.eventOptions.push({
                label: element.eventName,
                value: element.eventId,
              });
            });
          } else {
            this.isDataAvailble = false;
            this.eventReadable = false;
            this.gameReadble = false;
            this.schoolReadble = false;
            this.messageService.add({
              key: "custom",
              severity: "error",
              summary: "Event not found for this year",
            });
          }
        } else {
          console.log("Data is blannk from service");
        }
      },
      (error) => {
        //this.errorAlert =true;
      }
    );
  }
  onEventChange(event) {
    this.studentAttendanceArray = [];
    this.studentAbsentArray = [];
    let yearVal = this.yearvalue.toString();
    let eventYear = yearVal.split("-");
    console.log("Hello" + eventYear[1]);
    this.selectedYearVal = eventYear[1];

    if (eventYear[1] > "2020") {
      console.log("Immgretae");
      this.reportGreaterForNewYear(event);
    } else {
      console.log("im less");

      this.eventValue = event.value;
      this.gameOptions = [];
      this.selectedGame = "";
      this.meritService.loadGameByEvent(this.eventValue, false).subscribe(
        (response) => {
          if (response !== "") {
            this.gameList = response;
            console.log(this.gameList);
            this.schoolReadble = false;
            if (this.gameList.length > 0) {
              this.gameOptions = [];
              this.gameReadble = true;
              this.isDataAvailble = false;
              this.gameList.forEach((element) => {
                this.gameOptions.push({
                  label: element.gameName,
                  value: element.gameId,
                });
              });
            } else {
              this.isDataAvailble = false;
              this.gameReadble = false;
              this.schoolReadble = false;
            }
          } else {
            console.log("Data is blannk from service");
          }
        },
        (error) => {
          //this.errorAlert =true;
        }
      );
    }
  }
  reportGreaterForNewYear(event) {
    this.eventValue = event.value;
    this.studentAttendanceArray = [];
    this.studentAbsentArray = [];
    this.consolateFileName = event.originalEvent.currentTarget.ariaLabel;

    this.gameOptions = [];
    this.selectedGame = "";
    this.meritService.loadGameForStaff(this.eventValue).subscribe(
      (response) => {
        if (response !== "") {
          this.gameList = response;
          this.schoolReadble = false;
          if (this.gameList.length > 0) {
            console.log(this.gameList);
            this.gameIdList = this.gameList[0].gameId.split(",");
            this.gameNameList = this.gameList[0].game_name.split(",");
            console.log("im game name" + this.gameNameList);
            this.myObjArray = [];

            for (let i = 0; i < this.gameIdList.length; i++) {
              this.myObjArray.push({
                gameId: Number(this.gameIdList[i]),
                game_name: this.gameNameList[i],
              });
            }

            this.gameOptions = [];
            this.gameReadble = true;
            this.isDataAvailble = false;
            this.gameOptions.push({
              label: "Please Select",
              value: "",
            });

            this.gameList.forEach((element) => {
              const gameIdAndName =
                element.gameId +
                "," +
                element.game_name +
                "," +
                element.gameType;
              this.gameOptions.push({
                label: element.game_name,
                value: gameIdAndName,
              });
            });
            console.log(
              "Im game options===>" + JSON.stringify(this.gameOptions)
            );
          } else {
            this.isDataAvailble = false;
            this.gameReadble = false;
            this.schoolReadble = false;
          }
        } else {
          console.log("Data is blannk from service");
        }
      },
      (error) => {
        //this.errorAlert =true;
      }
    );
  }
  loadGameChange(gameData) {
    this.studentAttendanceArray = [];
    this.studentAbsentArray = [];
    this.gameID = gameData.value;
    this.selectedSchool = "";

    const gameDataValues = gameData.value;
    this.gameArray = gameDataValues.split(",");
    const gameId = this.gameArray[0];
    // this.eventName =  this.eventArray[1];

    this.meritService.checkGameType(this.gameID).subscribe(
      (response) => {
        this.gameType = response;
        console.log("game Type" + JSON.stringify(this.gameType));
      },

      (error) => {
        //this.errorAlert =true;
      }
    );

    this.meritService.loadSchoolForPayment(this.eventValue, gameId).subscribe(
      (response) => {
        if (response !== "") {
          this.schoolList = response;
          if (this.schoolList.length > 0) {
            this.schoolOptions = [];
            this.schoolReadble = true;
            this.isDataAvailble = false;
            this.schoolOptions.push({
              label: "Please Select",
              value: "",
            });
            this.schoolList.forEach((element) => {
              const SchoolIdAndName =
                element.schoolId + "," + element.schoolName;
              this.schoolOptions.push({
                label: element.schoolName,
                value: SchoolIdAndName,
              });
            });
          } else {
            this.messageService.add({
              key: "custom",
              severity: "error",
              summary: "School not found for this game",
            });
            this.isDataAvailble = false;
            this.schoolReadble = false;
          }
        } else {
          console.log("Data is blannk from service");
        }
      },
      (error) => {
        //this.errorAlert =true;
      }
    );
  }

  loadschoolChange(schoolData) {
    this.studentAttendance = false;
    this.studentAttendanceArray = [];
    this.studentAbsentArray = [];
    this.attendanceArray = [];
    this.schoolID = schoolData.value;
    this.schoolDataArray = this.schoolID.split(",");
    this.schooName = this.schoolDataArray[1];
    if (this.schoolID !== "") {
      this.adminStudentProfileService
        .getStudentData(this.eventValue, this.gameID, this.schoolDataArray[0])
        .subscribe(
          (response) => {
            if (response !== "") {
              this.reportData = response;
              this.reportDataLength = this.reportData.length;

              if (this.reportDataLength > 0) {
                this.isDataAvailble = true;
                //  this.showspinner = false;
              }
            } else {
              console.log("Data is blannk from service");
            }
          },
          (error) => {
            //this.errorAlert =true;
          }
        );
    } else {
      this.isDataAvailble = false;
    }
  }
  copyData(studentId, gameId, eventId, ageRange, gender) {
    this.isLoading = true;
    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("gameId", gameId);
    formData.append("eventId", eventId);
    formData.append("ageRange", ageRange);
    formData.append("gender", gender);
    formData.append("paymentId", "manual");

    this.parentDashboardService.updatePaymentStatus(formData).subscribe(
      (res) => {
        if (res.status === "success") {
          this.copyStudentData(studentId, gameId, eventId, ageRange, gender);
        }
      },
      (error) => {
        this.messageService.add({
          key: "custom",
          severity: "error",
          summary: error.errorDesc,
        });
      }
    );
  }
  copyStudentData(studentId, gameId, eventId, ageRange, gender) {
    this.parentDashboardService
      .copyStudentData(studentId, gameId, eventId, ageRange, gender)
      .subscribe(
        (res) => {
          this.isLoading = false;
          // Remove 'no-scroll' class from the body to unfreeze the screen

          if (res.status === "success") {
            this.messageService.add({
              key: "custom",
              severity: "success",
              summary: "Payment Accepted Successfully",
            });
          }
          this.showUpdatedPaymeData();
        },
        (error) => {
          this.isLoading = false;
          this.messageService.add({
            key: "custom",
            severity: "error",
            summary: error.errorDesc,
          });
        }
      );
  }

  showUpdatedPaymeData() {
    this.adminStudentProfileService
      .getStudentData(this.eventValue, this.gameID, this.schoolDataArray[0])
      .subscribe(
        (response) => {
          if (response !== "") {
            this.reportData = response;
            this.reportDataLength = this.reportData.length;
            for (let i = 0; i < this.reportData.length; i++) {
              if (this.reportData[i].isPresent === "1") {
                console.log("Im present");
              } else {
                console.log("im absent");
              }
            }

            if (this.reportDataLength > 0) {
              this.isDataAvailble = true;
              //  this.showspinner = false;
            }
          } else {
            console.log("Data is blannk from service");
          }
        },
        (error) => {
          //this.errorAlert =true;
        }
      );
  }
}
