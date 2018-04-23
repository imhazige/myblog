---
published: false
layout: post
comments: true
date: '2018-04-23 20:00 +08:00'
type: post
status: publish
categories:
  - Misc
tags:
  - git
---
## Use Git Via SSH

I always use git with https. But today, I found a git repository via https in not available from my country, some problem of the DNS or openssl, you understand...

So I have to use ssh. I think it should work, it really be.

My git repository is hosted on gitlab, I have to create a RSA key pair, as I use SourceTree, I can create a key pair via menu tools/Gernerate or import SSH keys. after that, I need upload the public key to the gitlab. Go to the /profile/keys sub directoty of the gitlab site. then you can add the public key.

Next, as I am using windows, I load the private key of the SSH agent(in this case it normallyu should be putty). On windows10, I can open it in the task bar. Then in the ui, I imported the private key.
![gitssh.png]({{site.baseurl}}/_posts/assets/gitssh.png)


Now go to the project home page, switch the type from https to ssh. copy that url to the sourcetree.

Then when you do operation on that repository, it will connect via ssh successfully.

I have no problem on Mac, so I have not try it on sourcetree mac version yet, but I think `ssh-add` may required to add the private key.

If you are keeping asked password of the repository, it mean you did not set the ssh authentication correctly.
