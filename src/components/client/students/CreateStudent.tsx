"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGroupsList } from "@/hooks/useGroups";
import { useCreateStudent } from "@/hooks/useStudents";
import { useSubjectsList } from "@/hooks/useSubjects";
import { useCreateTeacher } from "@/hooks/useTeachers";
import { SolarBoxMinimalisticBroken } from "@/icons/BoxIcon";
import {
  citizenships,
  documentTypes,
  nationalities,
  translateCitizenship,
  translateDocumentType,
  translateNationality,
} from "@/lib/composables";
import { notifyError, notifySuccess } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { StudentCreate, TeacherCreate } from "@/models/common.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  fullName: z.string().trim().min(5),
  groupId: z.string().uuid(),
  gender: z.enum(["male", "female"]),
  parentPhone: z.string().regex(/\+998\d{9}/),
  dateOfBirth: z
    .string()
    .regex(/\d{4}-\d{2}-\d{2}/)
    .optional(),
  nationality: z.enum(nationalities),
  citizenship: z.enum(citizenships),
  documentType: z.enum(documentTypes).optional(),
  documentSeries: z.string().length(2).optional(),
  documentNumber: z.string().regex(/\d+/).max(9999999).optional(),
  pinfl: z.string().regex(/\d+/).optional(),
});

export default function CreateStudent() {
  const groupsResponse = useGroupsList();
  const groups = groupsResponse?.data?.data || [];

  const { mutate: createStudent, isSuccess, error } = useCreateStudent();

  const [additionalFields, setAdditionalFields] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      notifySuccess("So'rov yuborildi");
    } else if (error) {
      if (error?.response?.data) {
        notifyError(
          (error?.response?.data as string) ||
            "So'rov yuborishda muammo yuzaga keldi",
        );
      } else {
        notifyError("So'rov yuborishda muammo yuzaga keldi");
      }
    } else return;
  }, [isSuccess, error]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nationality: nationalities[0],
      citizenship: citizenships[0],
      documentType: documentTypes[1],
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const newData: StudentCreate = {
      fullName: data.fullName,
      groupId: data.groupId,
      gender: data.gender,
      parentPhone: data.parentPhone,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      citizenship: data.citizenship,
      documentType: data.documentType,
      documentSeries: data.documentSeries,
      documentNumber: data.documentNumber,
      pinfl: data.pinfl,
    };
    createStudent(newData);
  };

  return (
    <Dialog
      onOpenChange={() => {
        form.reset();
      }}
    >
      <DialogTrigger>
        <Button className="bg-blue-700 hover:bg-blue-900">
          <SolarBoxMinimalisticBroken className="mr-2 h-6 w-6" />
          O&apos;quvchi qo&apos;shish
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle>O&apos;quvchi qo&apos;shish</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="text-lg text-red-500">*&nbsp;</span>
                      F.I.Sh.
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="F.I.Sh." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      <span className="text-lg text-red-500">*&nbsp;</span>
                      Sinf
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? ((): string => {
                                  const g = groups.find(
                                    (group) => group.id === field.value,
                                  );
                                  return `${g?.level}-${g?.name}`;
                                })()
                              : "Sinf tanlash"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Sinf qidirish..." />
                          <CommandEmpty>Sinf topilmadi.</CommandEmpty>
                          <CommandGroup>
                            {groups.map((group) => (
                              <CommandItem
                                value={`${group.level}-${group.name}`}
                                key={group.id}
                                onSelect={() => {
                                  form.setValue("groupId", group.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    group.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {group.level}-{group.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>
                      <span className="text-lg text-red-500">*&nbsp;</span>
                      Jinsi
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row items-center space-y-1"
                      >
                        <FormItem className="mr-4 flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Erkak</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Ayol</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="text-lg text-red-500">*&nbsp;</span>
                      Ota-onasini telefon raqami
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+998001234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tug&apos;ilgan sanasi</FormLabel>
                    <Input
                      type="date"
                      onChange={(ev) =>
                        ev.target.value
                          ? form.setValue("dateOfBirth", ev.target.value)
                          : form.setValue("dateOfBirth", undefined)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Accordion
                type="single"
                collapsible
                className="w-full"
                onValueChange={(v) =>
                  setAdditionalFields(v == "additional-fields")
                }
              >
                <AccordionItem value="additional-fields">
                  <AccordionContent className="dar:border-slate-600 mt-4 space-y-4 border-t pt-4">
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Millati</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row items-center space-y-1"
                            >
                              {nationalities.map((e) => (
                                <FormItem
                                  key={e}
                                  className="mr-4 flex items-center space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={e} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {translateNationality(e)}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="citizenship"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Fuqaroligi</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row items-center space-y-1"
                            >
                              {citizenships.map((e) => (
                                <FormItem
                                  key={e}
                                  className="mr-4 flex items-center space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={e} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {translateCitizenship(e)}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="documentType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Hujjat turi</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row items-center space-y-1"
                            >
                              {documentTypes.map((e) => (
                                <FormItem
                                  key={e}
                                  className="mr-4 flex items-center space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={e} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {translateDocumentType(e)}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="documentSeries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seriyasi</FormLabel>
                            <FormControl>
                              <Input
                                maxLength={2}
                                placeholder="AA"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="documentNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Raqami</FormLabel>
                              <FormControl>
                                <Input
                                  maxLength={7}
                                  placeholder="1234567"
                                  {...field}
                                  onChange={(ev) => {
                                    ev.target.value
                                      ? form.setValue(
                                          "documentNumber",
                                          ev.target.value,
                                        )
                                      : form.setValue(
                                          "documentNumber",
                                          undefined,
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="pinfl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PINFL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="PINFL"
                              {...field}
                              onChange={(ev) =>
                                ev.target.value
                                  ? form.setValue("pinfl", ev.target.value)
                                  : form.setValue("pinfl", undefined)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                  <AccordionTrigger className="h-9 w-20 rounded px-4 py-2 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50">
                    {additionalFields ? (
                      <>Qo&apos;shimcha maydonlarni yashirish</>
                    ) : (
                      <>Qo&apos;shimcha maydonlarni ko&apos;rsatish</>
                    )}
                  </AccordionTrigger>
                </AccordionItem>
              </Accordion>

              <Button type="submit" className="bg-green-600">
                Qo&apos;shish
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
