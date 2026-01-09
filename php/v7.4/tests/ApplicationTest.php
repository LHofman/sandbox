<?php

use PHPUnit\Framework\TestCase;
use App\Application;

class ApplicationTest extends TestCase {
  public function testRun() {
    $app = new Application();
    $this->expectOutputString('Hello World!');
    $app->run();
  }
}
