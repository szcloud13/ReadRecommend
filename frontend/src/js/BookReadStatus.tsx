// BookReadStatus.tsx
// Switch component for tracking a user's reading status for a book in their library/collection.

import React, { useState } from "react";
import * as $ from "jquery";

import CookieService from "../services/CookieService";

// Material UI
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

declare const API_URL: string;

interface Props {
    bookId: boolean;
}

const BookReadStatus: React.FC<Props> = ({ bookId }: Props) => {
    const token = CookieService.get("access_token");
    const [statusChanged, setStatusChanged] = useState<boolean>(false);

    function initialiseReadStatus(bookId) : boolean {
        let status = false;
        var data = getReadStatus(bookId, function (data) {
            status = data.is_read;
        });
        return status;
    }

    function getReadStatus(bookId, callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/books/is_read",
            data: {
                auth: token,
                book_id: bookId
            }, 
            method: "GET",
            success: function (data) {
                if (data != null) {
                    console.log(data.is_read);
                    callback(data);
                } else {
                    callback(null);
                }
            },
            error: function() {
                console.log("server error!");
                callback(null);
            }
        })
    }

    // Toggles the read status of a book in a user's library between read and unread.
    function toggleRead(bookId) {
        var data = setReadStatus(bookId, function (data) {
            setStatusChanged(!statusChanged);
        });
    }

    function setReadStatus(bookId, callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/books/set_read",
            data: {
                auth: token,
                book_id: bookId,
            },
            method: "POST",
            success: function (data) {
                if (data != null) {
                    console.log(data.message);
                    callback(data);
                } else {
                    callback(null);
                }
            },
            error: function() {
                console.log("server error!");
                callback(null);
            }
        })
    }

    return (
        <React.Fragment>
            {/* Switch To Display Read Status of Book */}
            <FormGroup row>
                <FormControlLabel control={<Switch checked={initialiseReadStatus(bookId)} onChange={() => toggleRead(bookId)} color="primary"/>} label="Read Status"/>
            </FormGroup>
        </React.Fragment>
    )
}

export default BookReadStatus;