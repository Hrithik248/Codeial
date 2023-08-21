const gulp=require('gulp');
//follow below syntax for importing gulp
const sass = require('gulp-sass')(require('node-sass'));
const cssnano=require('gulp-cssnano');
const uglify=require('gulp-uglify-es').default;
//const imagemin=require('gulp-imagemin');
//const del=require('del');
//const rev=require('gulp-rev');
gulp.task('css', async (done) => {
    const rev=await import('gulp-rev').then((module)=>{
        return module.default||module.rev;
    })
    console.log('Minifying CSS');
    gulp.src('./assets/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/'))
    .pipe(rev.manifest({
        cwd:'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});
/*gulp.task('css', async (done) => {
    const rev=await import('gulp-rev').then((module)=>{
        return module.default||module.rev;
    })
    console.log('Minifying CSS');*/
    //gulp.src('./assets/scss/**/*.scss')
    /*.pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/minified_css'));
    console.log('Minified CSS');*/
    //gulp.src('./assets/minified_css/**/*.css')
    /*.pipe(rev())
    .pipe(gulp.dest('./public/assets/'))
    .pipe(rev.manifest({
        cwd:'public',
        merge: true
    })).pipe(
    gulp.dest('./public/assets/')
    );
    done();
});*/

gulp.task('js',async function(done){
    const rev=await import('gulp-rev').then((module)=>{
        return module.default||module.rev;
    });
    console.log('minifying js...');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets/'));
    done();
});

gulp.task('images',async (done)=>{
    const rev=await import('gulp-rev').then((module)=>{
        return module.default||module.rev;
    });
    const imagemin=await import('gulp-imagemin').then((module)=>{
        return module.default;
    });
    console.log('compressing images');
    gulp.src('./assets/**/*.+(png|jpg|jpeg|svg|gif)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets/'));
    done();
});

//empty the public/assets directory

gulp.task('clean:assets',async(done)=>{
    const del=await import('del').then((module)=>{
        return module.deleteSync;
    })
    del(['./public/assets'], { force:true });
    done();
});

gulp.task('build',gulp.series('clean:assets','css','js','images'),function(done){
    console.log('building assets');
    done();
});
