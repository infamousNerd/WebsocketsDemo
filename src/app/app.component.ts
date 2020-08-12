import { Component, OnInit, ErrorHandler } from '@angular/core';
import { StartupService } from './startup.service';
import { SocketService } from './socket.service';
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private startupService: StartupService, private socketService: SocketService, private fb: FormBuilder) {
  }

  private records = this.startupService.preFillData;
  private noRecords = false;
  public filteredRecords;
  ngOnInit () {
    this.filteredRecords = [].concat(this.records);
    this.socketService.socketData.subscribe((newData) => {
      this.records = [].concat(newData);
      this.filterChange();
    }, (error) => {
      alert('An API operation failed' + ' ' + error);
    });
  }

  filters = this.fb.group({
    StatN: [true],
    StatY: [true],
    Clicks: [true],
    Impressions: [true],
    IdMapping: [true],
    VideoEvents: [true]
  });

  filterChange() {
    const filterVals = this.filters.value;
    const fileTypes = Object.keys(filterVals);
    fileTypes.splice(0, 2);
    const statusFiltered = this.records.reduce((acc, val) => {
      if (filterVals.StatN && val.status === "N") {
        acc.push(val);
      } else if (filterVals.StatY && val.status === "Y") {
        acc.push(val);
      } else {
        this.noRecords = true;
        return acc;
      }
      return acc;
    }, []);
    this.noRecords = statusFiltered.length ? false : true;
    this.filteredRecords = this.noRecords ? [].concat(statusFiltered) : statusFiltered.reduce((acc, val) => {
      const checkedType = fileTypes.find(type => filterVals[type]);
      if (!checkedType) {
        this.noRecords = true;
        return acc;
      }
      fileTypes.forEach(type => {
        const dataVal = type.toLowerCase();
        if (filterVals[type] && val.file_type === dataVal) {
          acc.push(val);
        }
      });
      return acc;
    }, []);
    // if (this.noRecords) {
    //   const filterKeys = Object.keys(this.filters);
    //   filterKeys.forEach(key => {
    //     this.filters[key].writeValue(false);
    //   });
    // }
  }
}
