
geotab.addin.GLAssignedHOSLogsAudit = function (api, state) {
    var center = document.getElementById("center"),

        //Table Creator function called after entities are filtered and grabbed by default pull
        tableCreator = function (entities) {
            var tableElement = document.createElement("TABLE");
            var thead = document.createElement("THEAD");
            var tbody = document.createElement("TBODY");
            var tr = document.createElement("TR");

            // Create "HOS Log Status" header, will be clickable column to go to HOS LOG ID, if exist
            // NEW -- Keeping same initial header and coloring potentially adding yellow and "Pending" Status (th1), this column will essentially fill in loading..., then statuses/removals
            var th1 = document.createElement("TH");
            th1.textContent = "HOS Log Status";
            tr.appendChild(th1);

            // OLD -- Create "Rejected/Accepted Date (Recent First)" header
            // NEW -- create a "Manually Assigned By" header (was th6)
            var th2 = document.createElement("TH");
            th2.textContent = "Manually Assigned By";
            tr.appendChild(th2);

            // OLD -- Create "User/Driver" header
            // NEW-- Create a "Assignment Date (Recent First)" header (was th8) (also will now sort by recent first here on manager initiate instead of driver accept/reject)
            var th3 = document.createElement("TH");
            th3.textContent = "Assignment Date (Recent First)";
            tr.appendChild(th3);

            // OLD -- Create "Vehicle" header
            // NEW -- Create "User/Driver" header (was th3)
            var th4 = document.createElement("TH");
            th4.textContent = "User/Driver"
            tr.appendChild(th4);

            // OLD -- Create a "Date of HOS Log" header
            // NEW -- Create "Vehicle" header (was th4)
            var th5 = document.createElement("TH");
            th5.textContent = "Vehicle";
            tr.appendChild(th5);


            // create 3 placeholder headers for the 3 new columns to be filled in by second API call data details relation by LogID based on driver accept/reject
            // OLD -- create a "Manually Assigned By" header
            // NEW -- Create a "Date of HOS Log" header (was th5), this is also no longer a placeholder and grabbed during initial manager initiated call
            var th6 = document.createElement("TH");
            th6.textContent = "Date of HOS Log";
            tr.appendChild(th6);

            // OLD -- Create a "Log Status Type" header
            // NEW -- Staying in same place as can get from manager pull
            var th7 = document.createElement("TH");
            th7.textContent = "Log Status Type";
            tr.appendChild(th7);

            // OLD - Create a "Latest Assignment Date" header 
            // NEW -- Create "Driver Accepted/Rejected Date" header (was th2 and sorted by recent), will essentially be blank on pending and intially loading... til driver table addon
            var th8 = document.createElement("TH");
            th8.textContent = "Driver Accepted/Rejected Date";
            tr.appendChild(th8);


            // Append Completed Headers row to the table
            thead.appendChild(tr);
            tableElement.appendChild(thead);


            // Sort entites before creating table rows in descending order (latest first by order rejected/accepted)
            entities.sort(function (a, b) {
                var dateA = a.dateTime ? new Date(a.dateTime) : new Date(-8640000000000000);  //Earliest date in JS for no prop/no date
                var dateB = b.dateTime ? new Date(b.dateTime) : new Date(-8640000000000000);
                return dateB - dateA; // sort in descending order
            });


            // Create table rows and data entries out of API results object
            entities.forEach(function (entity) {

                // Create a new row for the entity and its shown details
                var tr = document.createElement("TR");

                // Create "HOS Log Status" cell, ith a "data-id" attribute defined by its id for later onclicks on cell
                var tdLogStatus = document.createElement("TD");
                tdLogStatus.setAttribute("data-id", entity.ID);
                console.log(entity.comment);
                // if (!entity.comment.includes('Added Annotations') && entity.comment.includes('State: Rejected') && entity.comment.includes('Origin: Unassigned')) {
                //     tdLogStatus.textContent = "REJECTED - Back to Unidentified";
                //     tdLogStatus.style.backgroundColor = '#f3c4c4'; // light red
                // } else if (!entity.comment.includes('Added Annotations') && entity.comment.includes('State: Rejected')) {
                //     tdLogStatus.textContent = 'REJECTED - Manual Log Addition (no longer exists)';
                //     tdLogStatus.style.backgroundColor = '#f3c4c4'; // light red
                // } else if (!entity.comment.includes('Added Annotations') && entity.comment.includes('State: Active')) {
                //     tdLogStatus.textContent = 'ACCEPTED - Driver Accepted Log';
                //     tdLogStatus.style.backgroundColor = '#cef3c4';
                // } else {
                //     tdLogStatus.textContent = entity.comment;
                // }
                tdLogStatus.textContent = "Loading...";
                tr.appendChild(tdLogStatus);


                // Create "Manually Added By" cell
                var tdManuallyAddedBy = document.createElement("TD");
                tdManuallyAddedBy.textContent = entity.userName;
                tr.appendChild(tdManuallyAddedBy);


                // Create "Assignment Date" cell
                var tdManuallyAddedDate = document.createElement("TD");
                tdManuallyAddedDate.textContent = "Loading...";
                if (entity.dateTime) {
                    var dateTimeDate = new Date(entity.dateTime);
                    var dateFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                    tdManuallyAddedDate.textContent = dateTimeDate.toLocaleDateString('en-us', dateFormatOptions).replace(',', '');
                } else {
                    tdManuallyAddedDate.textContent = "N/A";
                }
                tr.appendChild(tdManuallyAddedDate);


                // Create "UserName/Driver" cell  (this may be null/undefined until driver details due to parse comment, check later)
                var tdName = document.createElement("TD");
                tdName.textContent = entity.Driver;
                tr.appendChild(tdName);


                // Create "Device" cell from parsed string entry
                var tdDevice = document.createElement("TD");
                tdDevice.textContent = entity.Device;
                tr.appendChild(tdDevice);


                // Create "Date of HOS Log" cell, format to 02/12/2015 10:40:57 PM, convert to browser local TZ
                var tdTimestamp = document.createElement("TD");
                if (entity.Timestamp) {
                    var dateTimeDate = new Date(entity.Timestamp);
                    var dateFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                    tdTimestamp.textContent = dateTimeDate.toLocaleDateString('en-us', dateFormatOptions).replace(',', '');
                } else {
                    tdTimestamp.textContent = "N/A";
                }
                tr.appendChild(tdTimestamp);


                // Create "Log Type" cell
                var tdLogType = document.createElement("TD");
                tdLogType.textContent = entity.Status;
                tr.appendChild(tdLogType);



                // Create "Rejected dateTime" cell, format example content "dateTime": "2015-02-12T22:40:57.522Z" to 02/12/2015 10:40:57 PM, convert to browser local TZ
                // could also be "pending and no match to fill in later"
                var tdDateTime = document.createElement("TD");
                // if (entity.dateTime) {
                //     var dateTimeDate = new Date(entity.dateTime);
                //     var dateFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                //     tdDateTime.textContent = dateTimeDate.toLocaleDateString('en-us', dateFormatOptions).replace(',', '');
                // } else {
                //     tdDateTime.textContent = "N/A";
                // }
                tdDateTime.textContent = "Loading...";
                tr.appendChild(tdDateTime);


                // Append Completed new row to the in progress table body
                tbody.appendChild(tr);
            });

            // Append the completed output table body to the actual table element
            tableElement.appendChild(tbody);

            // Create a div element and add the now completed table element to it
            var divElement = document.createElement("DIV");
            divElement.className = "de-responsive-table";
            divElement.appendChild(tableElement);
            return divElement;
        },

        //Function for the Go to HOS logs button, gets context of what cell is clicked for which LOG ID and ignores where link wouldn't exist in system
        goToHOSLogs = function (event) {
            var id = event.target.getAttribute("data-id");
            var textContent = event.target.textContent;
            if (id && textContent !== 'REJECTED - Manual Log Addition (no longer exists)') {
                state.gotoPage("hosLog", {
                    id: id
                });
            }
        },
        //Function to grab and export current table structure to CSV triggered on export button click
        exportToCSV = function () {
            let headers = Array.from(document.querySelectorAll('.de-responsive-table table th')).map(th => th.textContent);
            let rows = Array.from(document.querySelectorAll('.de-responsive-table table tr')).slice(1); // Exclude header row
            let data = rows.map(row => Array.from(row.querySelectorAll('td')).map(td => td.textContent));

            let csvContent = headers.join(',') + '\n' + data.map(e => e.join(',')).join('\n');

            let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            let url = URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.setAttribute("href", url);
            let filedate = new Date();
            let fileyear = filedate.getFullYear();
            let filemonth = (filedate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based in JavaScript
            let fileday = filedate.getDate().toString().padStart(2, '0');
            let filename = 'GL_AssignedHOSLogsAudit' + fileday + filemonth + fileyear + '.csv';
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        //Function for handling refresh button clicks
        refreshDataButtonClickHandler = function () {
            // Get the startDate and endDate values from the date pickers
            var startDateValue = document.getElementById('fromDate').value;
            var endDateValue = document.getElementById('toDate').value;

            // Create new Date objects from the values
            var startDate = new Date(startDateValue);
            var endDate = new Date(endDateValue);

            // Adjust the dates based on the timezone offset
            startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
            endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());

            // Adjust startDate to the start of the day in local time
            startDate.setHours(0, 0, 0, 0);

            // Adjust endDate to the end of the day in local time
            endDate.setHours(23, 59, 59, 999);

            // Convert the dates to ISO strings
            var formattedFromDate = startDate.toISOString();
            var formattedToDate = endDate.toISOString();

            console.log('formattedFromDate on click : ' + formattedFromDate + '  formattedToDate on click : ' + formattedToDate);

            // Clear the inner HTML of the center div
            document.getElementById('center').innerHTML = '';

            // Call refreshPage again with the new dates
            refreshPage(formattedFromDate, formattedToDate);
        },


        //new format main function for API calls and redraws of table content 
        refreshPage = function (fromDate, toDate) {
            // If no arguments are provided, default to the current date and seven days ago
            let now = toDate ? new Date(toDate) : new Date();
            let sevenDaysAgo = fromDate ? new Date(fromDate) : new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

            let ISOtoDate = now.toISOString();
            let ISOfromDate = sevenDaysAgo.toISOString();

            // Format dates as "YYYY-MM-DD" as the date picker expects for values
            let pickerToDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            let pickerFromDate = `${sevenDaysAgo.getFullYear()}-${String(sevenDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(sevenDaysAgo.getDate()).padStart(2, '0')}`;

            document.getElementById('fromDate').value = pickerFromDate;
            document.getElementById('toDate').value = pickerToDate;
            //set max date of datepicker selectable to Today, local timezone
            let today = new Date();
            document.getElementById('toDate').max = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;



            // Get the refreshDataButton element, remove listener if it exists(doesnt fail if not), then add a new one to prevent duplication of API calls/table draw
            let refreshDataButton = document.getElementById('refreshDataButton');
            refreshDataButton.removeEventListener('click', refreshDataButtonClickHandler);
            refreshDataButton.addEventListener('click', refreshDataButtonClickHandler);


            api.call("Get", {
                typeName: "Audit",
                search: {
                    name: "HosLogEdit",
                    fromDate: ISOfromDate,
                    toDate: ISOtoDate
                },
                resultsLimit: 50000
            }, function (result) {

                // Function for parsing Audit EDIT Log HOS items and fields
                function extractValues(logString) {
                    try {
                        const idMatch = logString.match(/ID: ([\w\-_]+)/);
                        const stateMatch = logString.match(/State: (\w+)/);
                        const statusMatch = logString.match(/Status: (\w+)/);
                        const eventRecordStatusMatch = logString.match(/EventRecordStatus: (\d+)/);
                        const driver = logString.match(/Driver: (\w+)/);
                        const deviceMatch = logString.match(/Device: ([\w-]+)/);
                        const timestamp = logString.match(/Timestamp: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/);


                        const extractResult = {
                            ID: idMatch ? idMatch[1] : undefined,
                            State: stateMatch ? stateMatch[1] : undefined,
                            Status: statusMatch ? statusMatch[1] : undefined,
                            EventRecordStatus: eventRecordStatusMatch ? parseInt(eventRecordStatusMatch[1], 10) : undefined,
                            Driver: driver ? driver[1] : undefined,
                            Device: deviceMatch ? deviceMatch[1] : undefined,
                            Timestamp: timestamp ? timestamp[1] : undefined
                        };

                        return extractResult;
                    } catch (error) {
                        console.error('Error parsing the log string', error);
                        return null;
                    }
                }

                // Add Eventer Listener to Parent Div to handle event delegation for any children in table with event.target.getAttribute("data-id") in listed function
                center.addEventListener("click", goToHOSLogs, false);
                //temp log # of Edit Log results
                console.log('Number of AUDIT EDIT results received: ' + result.length);



                //Driver Accept/Rejects Filter from Edits
                // Filter HOS Results to just Rejected before passing into tableCreator using extractValues function above
                let driverFilteredResult = result
                    .filter(r => {
                        if (r.comment) {
                            let comment = r.comment.toLowerCase().replaceAll(' ', '');
                            return (!comment.includes('addedannotations')) && (comment.includes('state:rejected') || comment.includes('state:active'));
                        }
                        return false; // If r.comment is undefined or null, do not include r in the filtered result
                    })
                    .map(r => {
                        let info = extractValues(r.comment);
                        if (info) {
                            let {
                                ID,
                                State,
                                Status,
                                EventRecordStatus,
                                Driver,
                                Device,
                                Timestamp
                            } = info;
                            // console.log(`Driver:${Driver}, Device:${Device}, Timestamp:${Timestamp}, HOS Log ID:${ID}, State:${State}, Status:${Status}, EventRecordStatus:${EventRecordStatus}`);
                            return { ...r, ...info }; // Merge the properties of r and info
                        } else {
                            console.log('Error extracting info from Driver comment:', r.comment);
                            return null;
                        }
                    });




                // parse another managerFilteredResult to match up to the existing "data-id" rows and fill ID
                // function extractValuesfromManagerEdit(logString) {
                //     try {
                //         const idMatch = logString.match(/ID: ([\w\-_]+),/);

                //         const extractManagerEditResult = {
                //             ID: idMatch ? idMatch[1] : undefined
                //         };
                //         //temp console log the logstring
                //         console.log("HOS Manager EDIT comment ID", logString);

                //         return extractManagerEditResult;
                //     } catch (error) {
                //         console.error('Error parsing the HOS Manager EDIT log string', error);
                //         return null;
                //     }
                // }

                let managerFilteredResult = result
                    .filter(r => {
                        if (r.comment) {
                            let comment = r.comment.toLowerCase().replaceAll(' ', '');
                            return (comment.includes('state:requested') && comment.includes('origin:unassigned'));
                        }
                        return false; // If r.comment is undefined or null, do not include r in the filtered result
                    })
                    .map(r => {
                        let info = extractValues(r.comment);
                        if (info) {
                            let {
                                ID,
                                State,
                                Status,
                                EventRecordStatus,
                                Driver,
                                Device,
                                Timestamp
                            } = info;
                            // console.log(`Unassigned Manager edit ID:${ID}`);
                            return { ...r, ...info }; // Merge the properties of r and info
                        } else {
                            console.log('Error extracting info from Manager Edit comment:', r.comment);
                            return null;
                        }
                    });




                // look over the existing rows to fill in manager unassigned edits data 
                // ***** THIS NEEDS TO MOVE TO END AND BE A driverFilteredResult table update  ***************************  
                // let tableRows = center.getElementsByTagName("tr");
                // for (let i = 1; i < tableRows.length; i++) {
                //     //first row is actually headers row so starting loop at 1
                //     let row = tableRows[i];
                //     let id = row.getElementsByTagName("td")[0].getAttribute("data-id");
                //     let matchingAdd = managerFilteredResult.find(r => r.ID === id);
                //     if (matchingAdd) {
                //         let {
                //             userName,
                //             dateTime
                //         } = matchingAdd;
                //         let tdManuallyAddedBy = row.getElementsByTagName("td")[5];
                //         let tdLogType = row.getElementsByTagName("td")[6];
                //         let tdManuallyAddedDate = row.getElementsByTagName("td")[7];
                //         tdManuallyAddedBy.textContent = userName;
                //         tdLogType.textContent = "Auto Created D/ON";
                //         // Convert the dateTime property to a friendly format for ManuallyAddedDate
                //         let date = new Date(dateTime);
                //         let options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                //         tdManuallyAddedDate.textContent = date.toLocaleDateString('en-US', options).replace(',', '');
                //     }
                // }





                // After table created with placeholders for HOS ADD Audit entries in place and HOS EDIT Table is filled and modified with edit additional manager data
                // get the HOS ADD results to filter and parse and match back up to "data-id" rows
                api.call("Get", {
                    typeName: "Audit",
                    search: {
                        name: "HosLogAdd",
                        fromDate: ISOfromDate,
                        toDate: ISOtoDate
                    },
                    resultsLimit: 50000
                }, function (result) {
                    //function to parse HOS ADD comment HOS log ID and Log Status
                    // function extractValuesFromAddHOS(logString) {
                    //     try {
                    //         const idMatch = logString.match(/ID: ([\w\-_]+),/);
                    //         const statusMatch = logString.match(/Status: (\w+),/);

                    //         const extractHOSAddResult = {
                    //             ID: idMatch ? idMatch[1] : undefined,
                    //             Status: statusMatch ? statusMatch[1] : undefined
                    //         };
                    //         //temp console log the logstring
                    //         console.log("HOS ADD comment", logString);

                    //         return extractHOSAddResult;
                    //     } catch (error) {
                    //         console.error('Error parsing the HOS ADD log string', error);
                    //         return null;
                    //     }
                    // }

                    //temp log # of Add Log results
                    console.log('Number of AUDIT ADD results received: ' + result.length);

                    // Filter HOS Results to just Other Authenticate User Adds 
                    let managerFilteredResultAdds = result
                        .filter(r => {
                            if (r.comment) {
                                let comment = r.comment.toLowerCase().replaceAll(' ', '');
                                return (comment.includes('origin:otherauthenticateduser'));
                            }
                            return false; // If r.comment is undefined or null, do not include r in the filtered result
                        })
                        .map(r => {
                            let info = extractValues(r.comment);
                            if (info) {
                                let {
                                    ID,
                                    State,
                                    Status,
                                    EventRecordStatus,
                                    Driver,
                                    Device,
                                    Timestamp
                                } = info;
                                // console.log(`HOS ADD COMMENT - ID:${ID}, Status:${Status}`);
                                return { ...r, ...info }; // Merge the properties of r and info
                            } else {
                                console.log('Error extracting info from Manager Add comment:', r.comment);
                                return null;
                            }
                        });


                    //Combine the filtered Manager Edits and Adds Arrays by spreading and send over to tableCreator
                    let managerCombinedResult = [...managerFilteredResult, ...managerFilteredResultAdds];
                    center.appendChild(tableCreator(managerCombinedResult));
                    //HOS  API NOW COMPLETED AND TABLE BUILT out of Manager Edits/Adds
                    //MORE TO COME, Parse through the now built table matching up drivers and then "pending" the missings



                    // Get the Existing Edit HOS table rows and iterate through them to match up the HOS ADD results to the "data-id" rows
                    let tableRows = center.getElementsByTagName("tr");
                    for (let i = 1; i < tableRows.length; i++) {
                        //first row is actually headers row so starting loop at 1
                        let row = tableRows[i];
                        let id = row.getElementsByTagName("td")[0].getAttribute("data-id");
                        let matchingAcceptReject = driverFilteredResult.find(r => r.ID === id);
                        if (matchingAcceptReject) {
                            let {
                                userName,
                                comment,
                                Status,
                                dateTime
                            } = matchingAcceptReject;
                            let tdLogStatus = row.getElementsByTagName("td")[0];
                            let tdDateTime = row.getElementsByTagName("td")[7];


                            //parse the driver comments where the id matches a row to fill in HOS Log Status details
                            if (!comment.includes('Added Annotations') && comment.includes('State: Rejected') && comment.includes('Origin: Unassigned')) {
                                tdLogStatus.textContent = "REJECTED - Back to Unidentified";
                                tdLogStatus.style.backgroundColor = '#f3c4c4'; // light red
                            } else if (!comment.includes('Added Annotations') && comment.includes('State: Rejected')) {
                                tdLogStatus.textContent = 'REJECTED - Manual Log Addition (no longer exists)';
                                tdLogStatus.style.backgroundColor = '#f3c4c4'; // light red
                            } else if (!comment.includes('Added Annotations') && comment.includes('State: Active')) {
                                tdLogStatus.textContent = 'ACCEPTED - Driver Accepted Log';
                                tdLogStatus.style.backgroundColor = '#cef3c4';
                            } else {
                                tdLogStatus.textContent = comment;
                            }

                            // Convert the dateTime property to a friendly format
                            let date = new Date(dateTime);
                            let options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                            tdDateTime.textContent = date.toLocaleDateString('en-US', options).replace(',', '');
                        }



                        // check final contents for leftover "Loading..." Cells in "Manually Assigned By" on resulting table as they are just Engine Power Up/Down Auto logs not to be shown
                        // let finalcheckcell = row.getElementsByTagName("td")[5];
                        // if (finalcheckcell.innerText === "Loading...") {
                        //     row.parentNode.removeChild(row);
                        //     i--; // IMPORTANT Decrement the counter as the rows list is now shorter
                        // }
                    }





                }, function (error) {
                    console.log(error.message);
                });
            }, function (error) {
                console.log(error.message);
            });


            //Main function for API calls and redraws of table content
            // refreshPage = function (fromDate, toDate) {
            //     // If no arguments are provided, default to the current date and seven days ago
            //     let now = toDate ? new Date(toDate) : new Date();
            //     let sevenDaysAgo = fromDate ? new Date(fromDate) : new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

            //     let ISOtoDate = now.toISOString();
            //     let ISOfromDate = sevenDaysAgo.toISOString();

            //     // Format dates as "YYYY-MM-DD" as the date picker expects for values
            //     let pickerToDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            //     let pickerFromDate = `${sevenDaysAgo.getFullYear()}-${String(sevenDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(sevenDaysAgo.getDate()).padStart(2, '0')}`;

            //     document.getElementById('fromDate').value = pickerFromDate;
            //     document.getElementById('toDate').value = pickerToDate;
            //     //set max date of datepicker selectable to Today, local timezone
            //     let today = new Date();
            //     document.getElementById('toDate').max = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;



            //     // Get the refreshDataButton element, remove listener if it exists(doesnt fail if not), then add a new one to prevent duplication of API calls/table draw
            //     let refreshDataButton = document.getElementById('refreshDataButton');
            //     refreshDataButton.removeEventListener('click', refreshDataButtonClickHandler);
            //     refreshDataButton.addEventListener('click', refreshDataButtonClickHandler);


            //     api.call("Get", {
            //         typeName: "Audit",
            //         search: {
            //             name: "HosLogEdit",
            //             fromDate: ISOfromDate,
            //             toDate: ISOtoDate
            //         },
            //         resultsLimit: 50000
            //     }, function (result) {

            //         // Function for parsing Audit EDIT Log HOS items and fields
            //         function extractValues(logString) {
            //             try {
            //                 const idMatch = logString.match(/ID: ([\w\-]+)/);
            //                 const stateMatch = logString.match(/State: (\w+)/);
            //                 const statusMatch = logString.match(/Status: (\w+)/);
            //                 const eventRecordStatusMatch = logString.match(/EventRecordStatus: (\d+)/);
            //                 const driver = logString.match(/Driver: (\w+)/);
            //                 const deviceMatch = logString.match(/Device: ([\w-]+)/);
            //                 const timestamp = logString.match(/Timestamp: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/);


            //                 const extractResult = {
            //                     ID: idMatch ? idMatch[1] : undefined,
            //                     State: stateMatch ? stateMatch[1] : undefined,
            //                     Status: statusMatch ? statusMatch[1] : undefined,
            //                     EventRecordStatus: eventRecordStatusMatch ? parseInt(eventRecordStatusMatch[1], 10) : undefined,
            //                     Driver: driver ? driver[1] : undefined,
            //                     Device: deviceMatch ? deviceMatch[1] : undefined,
            //                     Timestamp: timestamp ? timestamp[1] : undefined
            //                 };

            //                 return extractResult;
            //             } catch (error) {
            //                 console.error('Error parsing the log string', error);
            //                 return null;
            //             }
            //         }

            //         // Add Eventer Listener to Parent Div to handle event delegation for any children in table with event.target.getAttribute("data-id") in listed function
            //         center.addEventListener("click", goToHOSLogs, false);

            //         //temp log # of Edit Log results
            //         console.log('Number of AUDIT EDIT results received: ' + result.length);

            //         // Filter HOS Results to just Rejected before passing into tableCreator using extractValues function above
            //         let filteredResult = result
            //             .filter(r => {
            //                 if (r.comment) {
            //                     let comment = r.comment.toLowerCase().replaceAll(' ', '');
            //                     return (!comment.includes('addedannotations')) && (comment.includes('state:rejected') || comment.includes('state:active'));
            //                 }
            //                 return false; // If r.comment is undefined or null, do not include r in the filtered result
            //             })
            //             .map(r => {
            //                 let info = extractValues(r.comment);
            //                 if (info) {
            //                     let {
            //                         ID,
            //                         State,
            //                         Status,
            //                         EventRecordStatus,
            //                         Driver,
            //                         Device,
            //                         Timestamp
            //                     } = info;
            //                     console.log(`Driver:${Driver}, Device:${Device}, Timestamp:${Timestamp}, HOS Log ID:${ID}, State:${State}, Status:${Status}, EventRecordStatus:${EventRecordStatus}`);
            //                     return { ...r, ...info }; // Merge the properties of r and info
            //                 } else {
            //                     console.log('Error extracting info from comment:', r.comment);
            //                     return null;
            //                 }
            //             });

            //         center.appendChild(tableCreator(filteredResult));
            //         //HOS EDITS API NOW COMPLETED AND TABLE BUILT

            //         // parse another managerFilteredResult to match up to the existing "data-id" rows and fill ID
            //         function extractValuesfromManagerEdit(logString) {
            //             try {
            //                 const idMatch = logString.match(/ID: ([\w\-_]+),/);

            //                 const extractManagerEditResult = {
            //                     ID: idMatch ? idMatch[1] : undefined
            //                 };
            //                 //temp console log the logstring
            //                 console.log("HOS Manager EDIT comment ID", logString);

            //                 return extractManagerEditResult;
            //             } catch (error) {
            //                 console.error('Error parsing the HOS Manager EDIT log string', error);
            //                 return null;
            //             }
            //         }

            //         let managerFilteredResult = result
            //             .filter(r => {
            //                 if (r.comment) {
            //                     let comment = r.comment.toLowerCase().replaceAll(' ', '');
            //                     return (comment.includes('state:requested') && comment.includes('origin:unassigned'));
            //                 }
            //                 return false; // If r.comment is undefined or null, do not include r in the filtered result
            //             })
            //             .map(r => {
            //                 let info = extractValuesfromManagerEdit(r.comment);
            //                 if (info) {
            //                     let {
            //                         ID
            //                     } = info;
            //                     console.log(`Unassigned Manager edit ID:${ID}`);
            //                     return { ...r, ...info }; // Merge the properties of r and info
            //                 } else {
            //                     console.log('Error extracting info from comment:', r.comment);
            //                     return null;
            //                 }
            //             });

            //         // look over the existing rows to fill in manager unassigned edits data   
            //         let tableRows = center.getElementsByTagName("tr");
            //         for (let i = 1; i < tableRows.length; i++) {
            //             //first row is actually headers row so starting loop at 1
            //             let row = tableRows[i];
            //             let id = row.getElementsByTagName("td")[0].getAttribute("data-id");
            //             let matchingAdd = managerFilteredResult.find(r => r.ID === id);
            //             if (matchingAdd) {
            //                 let {
            //                     userName,
            //                     dateTime
            //                 } = matchingAdd;
            //                 let tdManuallyAddedBy = row.getElementsByTagName("td")[5];
            //                 let tdLogType = row.getElementsByTagName("td")[6];
            //                 let tdManuallyAddedDate = row.getElementsByTagName("td")[7];
            //                 tdManuallyAddedBy.textContent = userName;
            //                 tdLogType.textContent = "Auto Created D/ON";
            //                 // Convert the dateTime property to a friendly format for ManuallyAddedDate
            //                 let date = new Date(dateTime);
            //                 let options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            //                 tdManuallyAddedDate.textContent = date.toLocaleDateString('en-US', options).replace(',', '');
            //             }
            //         }


            //         // After table created with placeholders for HOS ADD Audit entries in place and HOS EDIT Table is filled and modified with edit additional manager data
            //         // get the HOS ADD results to filter and parse and match back up to "data-id" rows
            //         api.call("Get", {
            //             typeName: "Audit",
            //             search: {
            //                 name: "HosLogAdd",
            //                 fromDate: ISOfromDate,
            //                 toDate: ISOtoDate
            //             },
            //             resultsLimit: 50000
            //         }, function (result) {
            //             //function to parse HOS ADD comment HOS log ID and Log Status
            //             function extractValuesFromAddHOS(logString) {
            //                 try {
            //                     const idMatch = logString.match(/ID: ([\w\-_]+),/);
            //                     const statusMatch = logString.match(/Status: (\w+),/);

            //                     const extractHOSAddResult = {
            //                         ID: idMatch ? idMatch[1] : undefined,
            //                         Status: statusMatch ? statusMatch[1] : undefined
            //                     };
            //                     //temp console log the logstring
            //                     console.log("HOS ADD comment", logString);

            //                     return extractHOSAddResult;
            //                 } catch (error) {
            //                     console.error('Error parsing the HOS ADD log string', error);
            //                     return null;
            //                 }
            //             }

            //             //temp log # of Add Log results
            //             console.log('Number of AUDIT ADD results received: ' + result.length);

            //             // Filter HOS Results to just Other Authenticate User Adds 
            //             let filteredResult = result
            //                 .filter(r => {
            //                     if (r.comment) {
            //                         let comment = r.comment.toLowerCase().replaceAll(' ', '');
            //                         return (comment.includes('origin:otherauthenticateduser'));
            //                     }
            //                     return false; // If r.comment is undefined or null, do not include r in the filtered result
            //                 })
            //                 .map(r => {
            //                     let info = extractValuesFromAddHOS(r.comment);
            //                     if (info) {
            //                         let {
            //                             ID,
            //                             Status,
            //                         } = info;
            //                         console.log(`HOS ADD COMMENT - ID:${ID}, Status:${Status}`);
            //                         return { ...r, ...info }; // Merge the properties of r and info
            //                     } else {
            //                         console.log('Error extracting info from HOS ADD comment:', r.comment);
            //                         return null;
            //                     }
            //                 });

            //             // Get the Existing Edit HOS table rows and iterate through them to match up the HOS ADD results to the "data-id" rows
            //             let tableRows = center.getElementsByTagName("tr");
            //             for (let i = 1; i < tableRows.length; i++) {
            //                 //first row is actually headers row so starting loop at 1
            //                 let row = tableRows[i];
            //                 let id = row.getElementsByTagName("td")[0].getAttribute("data-id");
            //                 let matchingAdd = filteredResult.find(r => r.ID === id);
            //                 if (matchingAdd) {
            //                     let {
            //                         userName,
            //                         Status,
            //                         dateTime
            //                     } = matchingAdd;
            //                     let tdManuallyAddedBy = row.getElementsByTagName("td")[5];
            //                     let tdLogType = row.getElementsByTagName("td")[6];
            //                     let tdManuallyAddedDate = row.getElementsByTagName("td")[7];
            //                     tdManuallyAddedBy.textContent = userName;
            //                     tdLogType.textContent = Status;

            //                     // Convert the dateTime property to a friendly format
            //                     let date = new Date(dateTime);
            //                     let options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            //                     tdManuallyAddedDate.textContent = date.toLocaleDateString('en-US', options).replace(',', '');
            //                 }
            //                 // check final contents for leftover "Loading..." Cells in "Manually Assigned By" on resulting table as they are just Engine Power Up/Down Auto logs not to be shown
            //                 let finalcheckcell = row.getElementsByTagName("td")[5];
            //                 if (finalcheckcell.innerText === "Loading...") {
            //                     row.parentNode.removeChild(row);
            //                     i--; // IMPORTANT Decrement the counter as the rows list is now shorter
            //                 }
            //             }

            //         }, function (error) {
            //             console.log(error.message);
            //         });
            //     }, function (error) {
            //         console.log(error.message);
            //     });

            //Create searchable table listener after full table created
            let searchinput = document.getElementById('de-searchInput');
            let searchTableRows = center.getElementsByTagName("tr");

            searchinput.addEventListener('keyup', function () {
                let filter = searchinput.value.toUpperCase();

                for (let i = 1; i < searchTableRows.length; i++) {
                    let cells = searchTableRows[i].getElementsByTagName('td');

                    let match = Array.from(cells).some(cell => cell.innerText.toUpperCase().includes(filter));

                    if (match) {
                        searchTableRows[i].style.display = "";
                    } else {
                        searchTableRows[i].style.display = "none";
                    }
                }
            });

        },

        //Function to cleanup event listeners and remove the center div inner html when "blur" or in otherwords when user navigates away from addin page
        clearOnLeaving = function () {
            center.removeEventListener("click", goToHOSLogs, false);
            document.getElementById('de_ExportButton').removeEventListener('click', exportToCSV);
            center.innerHTML = "";
        };

    return {
        initialize: function (api, state, callback) {
            document.getElementById("de_HOSLogsButton")
                .addEventListener("click", function () {
                    state.gotoPage("hosLogs");
                }, false);
            //document.getElementById('de_ExportButton').addEventListener('click', exportToCSV);
            callback();
        },
        focus: function (api, state) {
            //remove and readd Export Button Listener to make sure only 1 export even if navigate away from page
            document.getElementById('de_ExportButton').removeEventListener('click', exportToCSV);
            document.getElementById('de_ExportButton').addEventListener('click', exportToCSV);
            refreshPage();
        },
        blur: function (api, state) {
            clearOnLeaving();
        }
    }
};