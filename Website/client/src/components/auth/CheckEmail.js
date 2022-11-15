import React, { Fragment, useState } from 'react';

class CheckEmail extends React.Component {
    render () {
        return(
            <div className='loginSignup'>
                <div className='dark-overlay'>
                    <div className='loginSignup-inner'>
                        <div className='loginSignup-box'>
                            <h1 className='large text-primary'>Almost Done!</h1>
                            <h1 className='medium'>
                                We've sent you an email with a confirmation link. Please click the link in the email to finish creating your account.
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CheckEmail;