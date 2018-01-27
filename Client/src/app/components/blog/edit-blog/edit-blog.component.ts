import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { BlogService } from "../../../services/blog.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  message  ;
  loading = true ;

  messageClass ;
  blog;
  proccessing = false;
  currentUrl ;
  constructor(
    private location : Location ,
    private activatedRoute :ActivatedRoute,
    private blogService : BlogService,
    private router :Router
  ) { }

updateBlogSubmit(){
  this.proccessing = true ;
  this.blogService.editBlog(this.blog).subscribe((data) => {
    if (!data.success) {
      this.messageClass="alert alert-danger animated fadeIn";
      this.message = data.message ;
      this.proccessing = false ;

    } else {
      this.messageClass="alert alert-success animated fadeIn";
      this.message = data.message ; 
      setTimeout(() => {
        this.router.navigate(['/blog'])
      }, 2000);
    }
  })
}

goBack(){
  this.location.back();
}
  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlogs(this.currentUrl.id).subscribe((data) => {
      
      if (!data.success) {
        this.messageClass="alert alert-danger animated bounceIn"
        this.message=data.message
      } else {
      this.blog = data.blog    ;  
          this.loading = false;
      }
    })
  }

}
