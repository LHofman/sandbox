<?php

namespace App\PHPFunctions;

use __PHP_Incomplete_Class;
use PHPUnit\Framework\TestCase;

set_error_handler(function (int $severity, string $message) {
  if ($severity === E_WARNING) {
      throw new \ErrorException($message, 0, $severity);
  }

  return false;
});

class UnserializeTest extends TestCase {
  /**
   * @dataProvider varsProvider
   */
  public function testUnserializeSerializedVar(mixed $var) {
    $serialized = serialize($var);

    var_dump($serialized);

    $unserialized = unserialize($serialized);
    $this->assertEquals($var, $unserialized);
  }

  public function varsProvider(): array {
    $stdClass = new \stdClass();
    $stdClass->a = 1;
    $stdClass->b = 2;

    return [
      ['randomText'],
      [12345],
      [12.345],
      [true],
      [null],
      [['one', 'two', 'three']],
      [['first' => 1, 'second' => 2, 'third' => 3]],
      [['nested' => ['a' => 'A', 'b' => ['B1', 'B2']]]],
      [$stdClass],
      [new TestClass('value1', 42)],
    ];
  }

  public function testCustomUnserialize() {
    $obj = new TestClassWithUnserialize(['key1' => 'value1', 'key2' => 'value2']);
    $counter = TestClassWithUnserialize::$counter;

    $serialized = serialize($obj);

    var_dump($serialized);

    $this->assertStringContainsString('counter', $serialized);

    $unserialized = unserialize($serialized);

    $this->assertEquals($obj, $unserialized);
    $this->assertEquals($counter + 1, TestClassWithUnserialize::$counter);
  }

  public function testUnserializeNotAllowedClass() {
    $obj = new TestClass('value1', 42);
    $serialized = serialize($obj);

    $unserialized = unserialize($serialized, ['allowed_classes' => false]);

    $this->assertInstanceOf(__PHP_Incomplete_Class::class, $unserialized);
  }

  public function testUnserializeAllowedClass() {
    $obj = new TestClass('value1', 42);
    $serialized = serialize($obj);

    $unserialized = unserialize($serialized, ['allowed_classes' => [TestClass::class]]);

    $this->assertInstanceOf(TestClass::class, $unserialized);
    $this->assertEquals($obj, $unserialized);
  }

  public function testUnserializeArrayMaxDepth() {
    $var = ['a' => ['b' => ['c' => ['d' => 'deepValue']]]];
    $serialized = serialize($var);

    $this->expectException(\ErrorException::class);
    unserialize($serialized, ['max_depth' => 2]);
  }

  public function testUnserializeClassMaxDepth() {
    $obj = new TestClass('value1', new TestClass('value2', new TestClass('value3', 'deepValue')));
    $serialized = serialize($obj);

    $this->expectException(\ErrorException::class);
    unserialize($serialized, ['max_depth' => 2]);
  }
}

class TestClass {
  public $prop1;
  public $prop2;

  public function __construct($prop1, $prop2) {
    $this->prop1 = $prop1;
    $this->prop2 = $prop2;
  }
}

class TestClassWithUnserialize {
  private array $data;
  public static int $counter = 7;

  public function __construct($data) {
    $this->data = $data;
  }

  public function __unserialize(array $data): void {
    $this->data = $data['data'];
    self::$counter = $data['counter'] + 1;
  }

  public function __serialize(): array {
    return ['data' => $this->data, 'counter' => self::$counter];
  }
}
