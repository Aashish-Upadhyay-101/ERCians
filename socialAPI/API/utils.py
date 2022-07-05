# from email.message import EmailMessage
# import ssl
# import smtplib

# email_sender = 'aashish.upadhyay98651@gmail.com'
# email_password = 'aswbthxrrljxadly'
# email_receiver = 'hbeing427@gmail.com'

# subject = 'Check the email first'
# body = 'email from django'


# em = EmailMessage()
# em['From'] = email_sender
# em['To'] = email_receiver
# em['Subject'] = subject
# em.set_content(body)

# context = ssl.create_default_context()

# with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
#     smtp.login(email_sender, email_password)
#     smtp.sendmail(email_sender, email_receiver, em.as_string())


# class EmailSender:
#     def __init__(self, receiver, subject, body):
#         self.receiver = receiver
#         self.subject = subject 
#         self.body = body 

#     def send_mail(self):
#         email_message = EmailMessage() 
#         email_message['From'] = 